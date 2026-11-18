import sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

src, dst = sys.argv[1], sys.argv[2]
im = np.asarray(Image.open(src).convert('RGBA')).astype(np.float32)
rgb, a = im[..., :3], im[..., 3] / 255.0
r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
solid = a > 0.5

# 1. Leftover backdrop: bluish or pale pixels (sky, window light) within a band of the outline.
dist_in = ndi.distance_transform_edt(solid)
band = solid & (dist_in < 70)
lum = 0.299 * r + 0.587 * g + 0.114 * b
bluish = (b > r + 12) & (b > g - 4) & (lum > 70)
leak = band & bluish
leak = ndi.binary_dilation(leak, iterations=3) & band
solid2 = solid & ~leak

# The subject runs off the top and side of the photo. Pad those borders first, so the
# clean-up below does not treat the photo's own edge as an outline and nibble at it.
PAD = 24
solid2 = np.pad(solid2, PAD, mode='edge')

# 2. Drop thin spurs and islands the leak removal left behind, keep the one big subject.
solid2 = ndi.binary_opening(solid2, structure=np.ones((9, 9)))
lab, n = ndi.label(solid2)
if n > 1:
    sizes = ndi.sum(solid2, lab, range(1, n + 1))
    solid2 = lab == (1 + int(np.argmax(sizes)))
solid2 = ndi.binary_fill_holes(solid2)

# 3. Pull the edge in a touch and feather it so there is no fringe.
solid2 = ndi.binary_erosion(solid2, iterations=2)
alpha = ndi.gaussian_filter(solid2.astype(np.float32), 1.6)
alpha = np.clip((alpha - 0.25) / 0.5, 0, 1)
alpha = alpha[PAD:-PAD, PAD:-PAD]
solid2 = solid2[PAD:-PAD, PAD:-PAD]

out = np.dstack([rgb, alpha * 255]).astype(np.uint8)
Image.fromarray(out, 'RGBA').save(dst)
print('removed px:', int(solid.sum() - solid2.sum()))

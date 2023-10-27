const sharp = require('sharp');
const multer = require('multer');
const prisma = require('../db');

const storageSettings = multer.diskStorage({
  destination: (req, file, cb) => {
    // Menentukan folder penyimpanan
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Menentukan nama file dengan menambahkan timestamp ke nama asli
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    const newFilename = `${timestamp}${extension}`;
    cb(null, newFilename);
  },
});

const uploadFile = multer({ storageSettings }).fields([
  { name: 'imageOne', maxCount: 1 },
  { name: 'imageTwo', maxCount: 1 },
]);

const createProduct = (req, res) => {
  uploadFile(req, res, async (error) => {
    if (error) {
      return res
        .status(500)
        .json({ msg: 'terjadi kesalahan dalam unggahan file' });
    }

    const { name, price } = req.body;

    try {
      // const imgFilesOne = req.files['imageOne'];
      const imgFilesOne = await sharp(req.files['imageOne'][0]).png().resize({
        width: 500,
        height: 500,
        fit: 'inside',
      });
      const imgFilesTWO = await sharp(req.files['imageTwo'][0]).png().resize({
        width: 500,
        height: 500,
        fit: 'inside',
      });

      await prisma.product.create({
        name: name,
        price: price,
      });

      res.status(200).json({ msg: 'produk berhasil dibuat' });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  });
};

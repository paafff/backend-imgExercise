const sharp = require('sharp');
const multer = require('multer');
const prisma = require('../db');
const fs = require('fs');
const path = require('path');
const { error } = require('console');

const storageSettings = multer.diskStorage({
  destination: (req, file, cb) => {
    // Menentukan folder penyimpanan
    cb(null, 'uploads/images');
  },
  filename: (req, file, cb) => {
    // Menentukan nama file dengan menambahkan timestamp ke nama asli
    const timestamp = Date.now();
    const newFilename = `${timestamp}.png`; // Ubah ekstensi menjadi .png jika diperlukan
    cb(null, newFilename);
  },
});

const uploadFile = multer({ storage: storageSettings }).fields([
  { name: 'imageOne', maxCount: 1 },
  { name: 'imageTwo', maxCount: 1 },
]);

//isi
const createProduct = (req, res) => {
  uploadFile(req, res, async (error) => {
    if (error) {
      return res
        .status(500)
        .json({ msg: 'Terjadi kesalahan dalam unggahan file' });
    }

    const { name, price } = req.body;

    try {
      //note : kalo lupa consolelog/res si req.files['imageOne'][0] aja

      const imgFilesOneFilename = req.files['imageOne'][0].filename;
      const imgFilesTwoFilename = req.files['imageTwo'][0].filename;

      // Ubah format menjadi URL
      const imgFilesOneURL = `http://localhost:5000/images/${imgFilesOneFilename}`;
      const imgFilesTwoURL = `http://localhost:5000/images/${imgFilesTwoFilename}`;

      await prisma.product.create({
        data: {
          name: name,
          price: price,
          image_name1: imgFilesOneFilename,
          image_name2: imgFilesTwoFilename,
          image_url1: imgFilesOneURL,
          image_url2: imgFilesTwoURL,
        },
      });

      res.status(200).json({ msg: 'produk berhasil dibuat' });

      // opsi pengecekan
      // const check = req.files['imageOne'][0];
      // res.status(200).json({ msg: { check } });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  });
};

const updateProduct = async (req, res) => {
  uploadFile(req, res, async (error) => {
    if (error) {
      return res
        .status(500)
        .json({ msg: 'terjadi kesalahan dalam unggahan file' });
    }

    const findProduct = await prisma.product.findUnique({
      where: {
        uuid: req.params.uuid,
      },
    });

    if (!findProduct)
      return res.status(404).json({ msg: 'produk tidak ditemukan' });

    const { name, price } = req.body;

    try {
      const imgFilesOneFilename = req.files['imageOne'][0].filename;
      const imgFilesTwoFilename = req.files['imageTwo'][0].filename;

      const imgFilesOneURL = `http://localhost:5000/images/${imgFilesOneFilename}`;
      const imgFilesTwoURL = `http://localhost:5000/images/${imgFilesTwoFilename}`;

      await prisma.product.update({
        where: { uuid: req.params.uuid },
        data: {
          name: name || undefined,
          price: price || undefined,
          image_name1: imgFilesOneFilename || undefined,
          image_name2: imgFilesTwoFilename || undefined,
          image_url1: imgFilesOneURL || undefined,
          image_url2: imgFilesTwoURL || undefined,
        },
      });

      res.status(200).json({ msg: 'produk berhasil diupdate' });
    } catch (error) {
      res.status(500).json({ msg: error.msg });
    }
  });
};

const deleteProduct = async (req, res) => {
  const findProduct = await prisma.product.findUnique({
    where: { uuid: req.params.uuid },
  });

  if (!findProduct)
    return res.status(404).json({ msg: 'produk tidak ditemukan' });

  try {
    const filePath1 = `./uploads/images/${findProduct.image_name1}`;
    // fs.unlinkSync(filePath1);
    const filePath2 = `./uploads/images/${findProduct.image_name2}`;
    // fs.unlinkSync(filePath2);

    // Hapus gambar pertama
    if (fs.existsSync(filePath1)) {
      fs.unlinkSync(filePath1);
    }

    // Hapus gambar kedua
    if (fs.existsSync(filePath2)) {
      fs.unlinkSync(filePath2);
    }

    await prisma.product.delete({
      where: {
        uuid: req.params.uuid,
      },
    });
    res.status(200).json({ msg: 'produk berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = { createProduct, deleteProduct };

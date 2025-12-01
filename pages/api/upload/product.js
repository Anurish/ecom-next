import nextConnect from "next-connect";
import multer from "multer";
import { verifyAdmin } from "../../../lib/verifyAdmin";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = "./public/uploads/products";

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + ext);
  },
});

const upload = multer({ storage });

const apiRoute = nextConnect();

// ADMIN CHECK
apiRoute.use((req, res, next) => {
  const auth = verifyAdmin(req, res);
  if (!auth.ok) return res.status(401).json({ msg: auth.msg });
  next();
});

apiRoute.use(upload.single("image"));

apiRoute.post((req, res) => {
  return res.status(200).json({
    imageUrl: `/uploads/products/${req.file.filename}`,
  });
});

export default apiRoute;

import { Router } from "express";
const router = Router();
router.post("/signin", (req, res) => {
  req.session.user = req.body.name;
  res.send({ msg: "Signin successfully", data: req.body });
});

export default router;

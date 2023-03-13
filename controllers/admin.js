exports.employeeData = (req, res, next) => {
  if (req.role == "admin") {
    return res.status(200).send({ message: "You can view employee data" });
  } else {
    res.status(403).send({ message: "Sorry Permission denied" });
    return;
  }
};

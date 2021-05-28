const router = require("express").Router();
const mongoose = require("mongoose");
var status = require("http-status");

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost:27017/students", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const Student = require("../models/student.model");

module.exports = () => {
  router.post("/", (req, res) => {
    var stu = req.body;
    Student.create(stu)
      .then((data) => {
        //console.log(data);
        res.json({
          code: status.OK,
          msg: "Se insertó correctamente",
          data: data,
        });
        //console.log(res);
      })
      .catch((err) => {
        res.status(status.BAD_REQUEST).json({
          code: status.BAD_REQUEST,
          msg: "Ocurrió un error",
          err: err.name,
          detail: err.message,
        });
      });
  });
  router.delete("/:cn", (req, res) => {
    Student.deleteOne({ controlnumber: req.params.cn })
      .then((data) => {
        res.json({
          code: status.OK,
          msg: "Se eliminó correctamente",
          date: data,
        });
      })
      .catch((err) => {
        res.status(status.BAD_REQUEST).json({
          code: status.BAD_REQUEST,
          msg: "Error en la peticion",
          err: err.name,
          detail: err.message,
        });
      });
  });
  router.get("/", (req, res) => {
    Student.find({})
      .then((students) => {
        res.json({
          code: status.OK,
          msg: "Consulta correcta",
          data: students,
        });
      })
      .catch((err) => {
        res.status(status.BAD_REQUEST).json({
          code: status.BAD_REQUEST,
          msg: "Error en la petición",
          err: err.name,
          detail: err.message,
        });
      });
  });
  //encontrar por numero de control
  router.get("/encontrar/:nc", (req, res) => {
    Student.findOne({ controlnumber: req.params.nc })
      .then((students) => {
        if (students == null)
          res.json({
            code: status.NOT_FOUND,
            msg: "Numero de control no encontrado",
          });
        else
          res.json({
            code: status.OK,
            msg: "Consulta correcta",
            data: students,
          });
      })
      .catch((err) => {
        res.status(status.BAD_REQUEST).json({
          code: status.BAD_REQUEST,
          msg: "Error en la petición",
          err: err.name,
          detail: err.message,
        });
      });
  });
  //update por numero de control
  router.put("/:nc", (req, res) => {
    Student.updateOne(
      { controlnumber: req.params.nc },
      { $set: { grade: req.body.grade } },
      { new: true }
    )
      .then((Student) => {
        if (Student)
          res.json({
            code: status.OK,
            msg: "Update completo",
            data: Student,
          });
        else
          res.status(status.BAD_REQUEST).json({
            code: status.BAD_REQUEST,
            msg: "Update fallido",
          });
      })
      .catch((err) => {
        res.status(status.BAD_REQUEST).json({
          code: status.BAD_REQUEST,
          msg: "Error en la petición",
          err: err.name,
          detail: err.message,
        });
      });
  });
  //Aprobados por genero
  router.get("/AprobadosGen", (req, res) => {
    Student.aggregate([
      {
        $match: { grade: { $gte: 70 } },
      },
      {
        $group: {
          _id: "$carrer",
          count: { $sum: 1 },
        },
      },
    ])
      .then((aprobado) => {
        Student.aggregate([
          {
            $match: { grade: { $lt: 70 } },
          },
          {
            $group: {
              _id: "$carrer",
              count: { $sum: 1 },
            },
          },
        ])
          .then((reprobado) => {
            res.json({
              code: status.OK,
              msg: "Datos",
              reprobados: reprobado,
              aprobados: aprobado,
            });
          })
          .catch((err) => {
            res.status(status.BAD_REQUEST).json({
              code: status.BAD_REQUEST,
              msg: "Error en la petición",
              err: err.name,
              detail: err.message,
            });
          });
      })
      .catch((err) => {
        res.status(status.BAD_REQUEST).json({
          code: status.BAD_REQUEST,
          msg: "Error en la petición",
          err: err.name,
          detail: err.message,
        });
      });
  });
  //Revisar estudiantes por genero
  router.get("/HomMuj", (req, res) => {
    Student.aggregate([
      {
        $match: { curp: /^.{10}[h,H].*/ },
      },
      {
        $group: {
          _id: "$carrer",
          count: { $sum: 1 },
        },
      },
    ])
      .then((hombre) => {
        Student.aggregate([
          {
            $match: { curp: /^.{10}[m,M].*/ },
          },
          {
            $group: {
              _id: "$carrer",
              count: { $sum: 1 },
            },
          },
        ])
          .then((mujer) => {
            res.json({
              code: status.OK,
              msg: "Datos",
              hombres: hombre,
              mujeres: mujer,
            });
          })
          .catch((err) => {
            res.status(status.BAD_REQUEST).json({
              code: status.BAD_REQUEST,
              msg: "Error en la petición",
              err: err.name,
              detail: err.message,
            });
          });
      })
      .catch((err) => {
        res.status(status.BAD_REQUEST).json({
          code: status.BAD_REQUEST,
          msg: "Error en la petición",
          err: err.name,
          detail: err.message,
        });
      });
  });
  //Foraneos por carrera(que no son de nayarit)
  router.get("/Foraneos", (req, res) => {
    Student.aggregate([
      {
        $match: { curp: /^.{11}[nt|NT]./ },
      },
      {
        $group: {
          _id: "$carrer",
          count: { $sum: 1 },
        },
      },
    ])
      .then((local) => {
        Student.aggregate([
          {
            $match: { curp: /^.{11}(?!([nt|NT])).*/ },
          },
          {
            $group: {
              _id: "$carrer",
              count: { $sum: 1 },
            },
          },
        ])
          .then((foraneo) => {
            res.json({
              code: status.OK,
              msg: "Datos",
              locales: local,
              foraneos: foraneo,
            });
          })
          .catch((err) => {
            res.status(status.BAD_REQUEST).json({
              code: status.BAD_REQUEST,
              msg: "Error en la petición",
              err: err.name,
              detail: err.message,
            });
          });
      })
      .catch((err) => {
        res.status(status.BAD_REQUEST).json({
          code: status.BAD_REQUEST,
          msg: "Error en la petición",
          err: err.name,
          detail: err.message,
        });
      });
  });
  router.get("/MayMen", (req, res) => {
    Student.aggregate([
    { $match: { curp: /(.{4}[0-9][0-9][0-9][0-9][0-9][0-9].{6}[0-9][0-9])|(.{4}[0][0-3][0-9][0-9][0-9][0-9].{6}[A-Z,a-z][0-9])/ } },
      { $group: { _id: "$carrer", count: { $sum: 1 } } },
    ])
      .then((mayor) => {
        Student.aggregate([
          { $match: { curp: /^(?!((.{4}[0-9][0-9][0-9][0-9][0-9][0-9].{6}[0-9][0-9])|(.{4}[0][0-3][0-9][0-9][0-9][0-9].{6}[A-Z,a-z][0-9])))/ } },
          { $group: { _id: "$carrer", count: { $sum: 1 } } },
        ])
          .then((menor) => {
            res.json({
              code: status.OK,
              msg: "Mayores y menores",
              Mayores: mayor,
              Menores: menor,
            }); //                  JSON del reprobrados
          })
          .catch((err) => {
            res.status(status.BAD_REQUEST).json({
              code: status.BAD_REQUEST,
              msg: "Error en la petición",
              err: err.name,
              detail: err.message,
            });
          });
      })
      .catch((err) => {
        res.status(status.BAD_REQUEST).json({
          code: status.BAD_REQUEST,
          msg: "Error en la petición",
          err: err.name,
          detail: err.message,
        });
      });
  });
  return router;
};

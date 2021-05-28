const mongoose = require("mongoose");
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const mongooseValidationErrorTransform = require('mongoose-validation-error-transform');
mongoose.plugin(mongooseValidationErrorTransform);

const schema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Falta el nombre"],
    maxlenght: [50, "El nombre es muy grande"],
    uppercase: [true, "Nombre en mayusculas porfavor"],
  },
  lastname: {
    type: String,
    required: [true, "Falta el segundo nombre"],
    maxlenght: [50, "El segundo nombre es muy grande"],
    uppercase: [true, "Segundo nombre en mayusculas porfavor"],
  },
  curp: {
    type: String,
    required: [true, "Falta la curp"],
    uppercase: [true, "Curp en mayusculas porfavor"],
    match: [
      /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/,
      "Curp no valida",
    ],
  },
  create_date: {
    type: Date,
    required: [true, "Falta la Fecha"],
    default: new Date(),
  },
  controlnumber: {
    type: String,
    required: [true, "Falta el numero de control"],
    unique: 'El numero de control ({VALUE}) ya existe'
  },
  grade: {
    type: Number,
    required: [true, "Falta la calificación"],
    min: [0, "La calificación no debe ser menor a 0"],
    max: [100, "La calificación no debe ser mayor a 100"],
  },
  carrer: {
    type: String,
    required: [true, "Falta la carrera"],
    enum: {
      values: ["ISC", "IM", "IGE", "IC"],
      message: "Carrera {VALUE} no soportada",
    },
  },
});


schema.plugin(beautifyUnique);

const studentModel = mongoose.model("Student", schema, "student");
module.exports = studentModel;

const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => {

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        ok: false,
        msg: 'Un usuario ya existe con ese correo.'
      });
    }

    user = new User(req.body);

    // Encriptar contrasenia
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    // Generar JWT
    const token = await generateJWT(user.id, user.name)

    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token
    })

  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador.'
    })
  }
}

const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: 'El usuario no existe con ese email.'
      });
    }

    // Confirmar contrasenia
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Password incorrecta.'
      });
    }

    // Generar nuestro JWT
    const token = await generateJWT(user.id, user.name)

    res.json({
      ok: true,
      uid: user.id,
      name: user.name,
      token
    })


  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Usuario y/o contrasenia incorrectos.'
    })
  }
}

const revalidarToken = async (req, res = response) => {
  const uid = req.uid;
  const name = req.name;

  // Generar nuevo JWT y retornarlo
  const token = await generateJWT(uid, name)

  res.json({
    ok: true,
    name, uid,
    token
  });

}

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken
}




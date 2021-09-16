import bcrypt from 'bcryptjs'

export const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'Van Gogh',
    email: 'vangogh@example.com',
    password: bcrypt.hashSync('123456', 10),
    // isAdmin: true, //we can omit this for user account as by default, this is false
  },
  {
    name: 'Antoni Gaudi',
    email: 'antonigaudi@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
]

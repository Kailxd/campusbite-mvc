require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const initDb = require('./config/initDb');
const { attachUser } = require('./middlewares/auth');

const indexRoutes = require('./routes/index');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const inventoryRoutes = require('./routes/inventory');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'partials/layout');
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: isProduction, httpOnly: true, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 4 }
}));
app.use(attachUser);

app.use('/', indexRoutes);
app.use('/productos', productRoutes);
app.use('/usuarios', userRoutes);
app.use('/inventario', inventoryRoutes);
app.use('/pedidos', orderRoutes);

app.use((req, res) => {
  res.status(404).render('home/404', { title: 'No encontrado' });
});

initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`CampusBite listo en puerto ${PORT}`));
  })
  .catch((error) => {
    console.error('Error inicializando la base de datos:', error);
    process.exit(1);
  });

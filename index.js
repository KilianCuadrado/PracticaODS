import app from './backend/app.js';

const port = 3000;

/**
 * Levanta el servidor http en el puerto configurado.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 */
app.listen(port, () => {
  console.log(`Server on http://localhost:${port}`);
});

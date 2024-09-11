import express from 'express';
import passport from 'passport';
import { authenticateToken } from '../middleware/authenticateToken.js'; // Path to your authMiddleware
import { googleCallback, studentRegisterWithMail, facultyRegisterWithMail, emailLogin } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', emailLogin);
router.post('/register/student', studentRegisterWithMail);
router.post('/register/faculty', facultyRegisterWithMail);
router.get('/auth/google/callback', passport.authenticate('google', { session: false }), googleCallback);
router.get('/protected', authenticateToken, (req, res) => {
    res.send('Protected route');
});

export default router;

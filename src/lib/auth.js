import jwt from 'jsonwebtoken';
import * as cookie from "cookie";

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = 'auth_token';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

if (!JWT_SECRET) {
    console.warn('[auth] JWT_SECRET belum di-set di environment variables.');
}

export function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: MAX_AGE_SECONDS });
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
}

export function setAuthCookie(res, token) {
    const cookieStr = cookie.stringifySetCookie({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: MAX_AGE_SECONDS,
    });
    res.setHeader('Set-Cookie', cookieStr);
}

export function clearAuthCookie(res) {
    const cookieStr = cookie.stringifySetCookie({
        name: COOKIE_NAME,
        value: '',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: -1,
    });
    res.setHeader('Set-Cookie', cookieStr);
}

export function getAuthUser(req) {
    const cookies = cookie.parseCookie(req.headers.cookie || '');
    const token = cookies[COOKIE_NAME];
    if (!token) return null;
    return verifyToken(token);
}

export { COOKIE_NAME };
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError.js";

export class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    // Register user baru
    async register(username, password) {
        // Cek apakah username sudah dipakai
        const existingUser = await this.userRepository.findUserByUsername(
            username
        );
        if (existingUser) {
            throw new AppError("Username already exists", 400);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Simpan user
        const newUser = await this.userRepository.createUser({
            username,
            password: hashedPassword,
        });

        return newUser;
    }

    // Login -> generate tokens
    async login(username, password) {
        const user = await this.userRepository.findUserByUsername(username);
        if (!user) {
            throw new AppError("Invalid credentials", 401);
        }

        // Cek password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new AppError("Invalid credentials", 401);
        }

        // Generate Access Token & Refresh Token
        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken(user);

        return { user, accessToken, refreshToken };
    }

    // Refresh Token
    async refreshToken(refreshToken) {
        try {
            const payload = jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET
            );
            // Payload contohnya { userId: 123, iat:..., exp:... }
            // Anda bisa cek ke DB atau logika lain di sini

            // Generate token baru
            const newAccessToken = jwt.sign(
                { userId: payload.userId },
                process.env.JWT_ACCESS_SECRET,
                { expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m" }
            );
            const newRefreshToken = jwt.sign(
                { userId: payload.userId },
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d" }
            );

            return { newAccessToken, newRefreshToken };
        } catch (error) {
            throw new AppError("Invalid refresh token", 401);
        }
    }

    // Generate Access Token
    generateAccessToken(user) {
        return jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET, {
            expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m",
        });
    }

    // Generate Refresh Token
    generateRefreshToken(user) {
        return jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, {
            expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d",
        });
    }
}

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError.js";

export class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    register = async (username, password) => {
        const existingUser = await this.userRepository.findUserByUsername(
            username
        );
        if (existingUser) {
            throw new AppError("Username already exists", 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await this.userRepository.createUser({
            username,
            password: hashedPassword,
        });

        return newUser;
    };

    login = async (username, password) => {
        const user = await this.userRepository.findUserByUsername(username);
        if (!user) {
            throw new AppError("Invalid credentials", 401);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new AppError("Invalid credentials", 401);
        }

        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken(user);

        return { user, accessToken, refreshToken };
    };

    refreshToken = async (refreshToken) => {
        try {
            const payload = jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET
            );

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
    };

    generateAccessToken(user) {
        return jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET, {
            expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m",
        });
    }

    generateRefreshToken(user) {
        return jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, {
            expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d",
        });
    }
}

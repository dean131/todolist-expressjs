export class AuthController {
    constructor(authService) {
        this.authService = authService;
    }

    register = async (req, res, next) => {
        try {
            const { username, password } = req.body;
            const user = await this.authService.register(username, password);
            return res.status(201).json({
                message: "User registered successfully",
                data: { id: user.id, username: user.username },
            });
        } catch (error) {
            next(error);
        }
    };

    login = async (req, res, next) => {
        try {
            const { username, password } = req.body;
            const { user, accessToken, refreshToken } =
                await this.authService.login(username, password);
            return res.status(200).json({
                message: "Login successful",
                data: {
                    user: { id: user.id, username: user.username },
                    accessToken,
                    refreshToken,
                },
            });
        } catch (error) {
            next(error);
        }
    };

    refreshToken = async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            const { newAccessToken, newRefreshToken } =
                await this.authService.refreshToken(refreshToken);
            return res.status(200).json({
                message: "Token refreshed",
                data: {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                },
            });
        } catch (error) {
            next(error);
        }
    };
}

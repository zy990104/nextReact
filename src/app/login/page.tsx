'use client'; // 声明客户端

import request from "@/utils/request";
import React, {useState, useEffect} from "react";

export default function Login() {
    // 状态定义
    const [captcha, setCaptcha] = useState(""); // 输入的验证码
    const [captchaUrl, setCaptchaUrl] = useState(null); // 保存验证码图片地址
    const [error, setError] = useState(""); // 错误信息

    // 获取验证码图片
    const getCaptcha = async () => {
        try {
            const response = await request.post("/base/captcha"); // 假设后台接口返回验证码图片
            setCaptchaUrl(response.data.picPath); // 设置验证码图片地址
        } catch (err) {
            console.error("获取验证码失败", err);
            setError("验证码加载失败，请稍后再试");
        }
    };

    // 组件加载时获取验证码
    useEffect(() => {
        getCaptcha().then(); // 初始加载时获取验证码
    }, []);

    return (
        <div className="bg-gray-100 flex items-center justify-center min-h-screen">
            {/* 登录容器 */}
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                {/* 标题 */}
                <h2 className="text-2xl font-bold text-center text-gray-700">登录</h2>
                <p className="text-sm text-center text-gray-500 mt-2">欢迎回来，请登录您的账户</p>

                {/* 登录表单 */}
                <form className="mt-6 space-y-4">
                    {/* 用户名 */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            用户名
                        </label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="请输入用户名"
                        />
                    </div>

                    {/* 密码 */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            密码
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="请输入密码"
                        />
                    </div>
                    {/* 验证码 */}
                    <div>
                        <label htmlFor="captcha" className="block text-sm font-medium text-gray-700">
                            验证码
                        </label>
                        <div className="flex items-center">
                            <input
                                type="text"
                                id="captcha"
                                name="captcha"
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="请输入验证码"
                                value={captcha}
                                onChange={(e) => setCaptcha(e.target.value)} // 处理输入框变化
                            />
                            <img
                                src={captchaUrl}
                                alt="验证码"
                                className="ml-2 cursor-pointer"
                                onClick={getCaptcha} // 点击图片刷新验证码
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>} {/* 错误提示 */}
                    </div>
                    {/* 提交按钮 */}
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                        >
                            登录
                        </button>
                    </div>
                </form>


            </div>
        </div>
    );
}

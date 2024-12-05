'use client'; // 声明客户端

import request from "@/utils/request";
import React, {useState, useEffect} from "react";
import {useRouter} from 'next/router';


export default function Login() {
    const router = useRouter();
    const [captchaData, setCaptchaData] = useState({url: '', captchaId: ''}); // 存储验证码图片地址和其他字段
    const [error, setError] = useState(""); // 错误信息
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        captcha: ''
    });
    // 获取验证码图片
    const getCaptcha = async () => {
        try {
            const response = await request.post("/base/captcha"); // 假设后台接口返回验证码图片
            setCaptchaData({url: response.data.picPath, captchaId: response.data.captchaId}); // 设置验证码图片地址
        } catch (err) {
            console.error("获取验证码失败", err);
            setError("验证码加载失败，请稍后再试");
        }
    };
    // 处理表单输入变化
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    // 处理表单提交
    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            captchaId: captchaData.captchaId // 将验证码ID一同提交
        };

        // 提交数据给后端
        try {
            const res = await request.post('/base/login', payload);
            console.log(res)
            // 判断返回是否包含 token
            if (res.data.token) {
                // 存储 token
                localStorage.setItem('token', res.data.token); // 使用 localStorage 存储 token
                // 登录成功后跳转到首页
                router.push('/'); // '/' 表示跳转到首页
            } else {
                setError("登录失败，未获取到 token");
            }
            // 根据后端返回的响应处理逻辑
        } catch (err) {
            console.error("表单提交失败", err);
            setError("表单提交失败，请稍后再试");
        }
    };
    // 组件加载时获取验证码
    useEffect(() => {
        getCaptcha().then(); // 初始加载时获取验证码
    }, []);
    useEffect(() => {
        // 确保这段逻辑只在客户端执行
        if (typeof window !== 'undefined') {
            // 如果已经登录或已经有 token 可以直接跳转到首页
            const token = localStorage.getItem('token');
            if (token) {
                router.push('/');
            }
        }
    }, [router]);

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
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            用户名
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="请输入用户名"
                            onChange={handleInputChange} // 处理输入框变化
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
                            value={formData.password}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="请输入密码"
                            onChange={handleInputChange} // 处理输入框变化
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
                                value={formData.captcha}
                                onChange={handleInputChange} // 处理输入框变化
                            />
                            <img
                                src={captchaData.url || undefined}
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
                            onClick={handleSubmit}
                        >
                            登录
                        </button>
                    </div>
                </form>


            </div>
        </div>
    );
}

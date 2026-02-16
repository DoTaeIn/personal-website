import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}", // App Router 사용 시 필수
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            // 여기에 커스텀 색상이나 폰트를 추가할 수 있습니다.
        },
    },
    plugins: [
        typography
    ],
};
export default config;
// constants/techConfig.tsx
import {
    Code, Terminal, Database, Cloud, Cpu, Globe,
    Bot, Gamepad2
} from 'lucide-react';



// 태그별 스타일 정의 (여기에 계속 추가하면 됩니다)
export const techConfig: Record<string, { icon: any, color: string, bg: string }> = {
    "Python": {
        icon: Terminal,
        color: "text-blue-500",
        bg: "bg-blue-500/10 border-blue-500/20"
    },
    "Next.js": {
        icon: Globe,
        color: "text-gray-800 dark:text-white",
        bg: "bg-gray-500/10 border-gray-500/20"
    },
    "Pytorch": {
        icon: Bot,
        color: "text-green-600",
        bg: "bg-green-500/10 border-green-500/20"
    },
    "Unity": {
        icon: Gamepad2, // Box 아이콘 import 필요
        color: "text-gray-600",
        bg: "bg-gray-500/10 border-gray-500/20"
    },
    "Default": {
        icon: Code,
        color: "text-slate-500",
        bg: "bg-slate-500/10 border-slate-500/20"
    }
};

export const getThemeByTags = (tags: string[]) => {
    if (!tags || tags.length === 0) return techConfig["Default"];

    // 첫 번째 태그를 메인으로 사용
    const mainTag = tags[0];
    return techConfig[mainTag] || techConfig["Default"];
};
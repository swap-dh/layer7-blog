"use client"
 
import Link from "next/link"
import { ThemeToggleButton } from "@/components/theme-toggle-button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { MenuIcon } from "lucide-react";
import { useState } from "react"
 
export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <header className="fixed top-0 z-50 h-16 w-screen border-b px-6 backdrop-blur-md">
        <div className="container mx-auto flex h-full items-center justify-between">
            blog
            {/* right button group div */}
            <div className="flex items-center justify-between gap-3 py-6 md:gap-9">
            {/* 데스크탑 링크 */}
            <nav className="hidden items-center space-x-8 md:flex">
                <Link href="/" className="transition-colors hover:text-blue-500">Home</Link>
                <Link href="/posts" className="transition-colors hover:text-blue-500">Posts</Link>
                <Link href="/about" className="transition-colors hover:text-blue-500">About</Link>
            </nav>
    
            {/* 테마 변경 버튼 */}
            <ThemeToggleButton/>
            {/* 모바일 메뉴 */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                <button className="md:hidden p-2" aria-label="Toggle menu"><MenuIcon className="size-6" /></button>
                </SheetTrigger>
                <SheetContent className="p-6 [&>button]:size-6 [&>button>svg]:size-6">
                <SheetHeader>
                    <SheetTitle className="sr-only">모바일 내비게이션 메뉴</SheetTitle>
                    <SheetDescription className="sr-only">이 다이얼로그는 모바일 환경에서 사용할 수 있는 내비게이션 메뉴입니다. 아래 링크를 선택하여 사이트의 주요 페이지로 이동할 수 있습니다.</SheetDescription>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 py-4">
                    <Link href="/" className="transition-colors hover:text-blue-500">Home</Link>
                    <Link href="/posts" className="transition-colors hover:text-blue-500">Posts</Link>
                    <Link href="/about" className="transition-colors hover:text-blue-500">About</Link>
                </nav>
                </SheetContent>
            </Sheet>
            
            </div>
        </div>
        </header>
  )
}
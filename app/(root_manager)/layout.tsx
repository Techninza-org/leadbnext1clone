import { NavigationBar } from "@/components/navigation/navigation-bar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <NavigationBar>
            <main>{children}</main>
        </NavigationBar>
    )
}
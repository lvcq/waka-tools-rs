import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App";
import { DashboardMainPage } from "./pages/dashboard/DashboardMainPage";
import { SettingsPage } from "./pages/settings/SettingsPage";
import { CropperListPage } from "@pages/cropper-list/CropperListPage";
import { CropperEditPage } from "@pages/cropper-edit/CropperEditPage"

export function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route path="dashboard" element={<DashboardMainPage />} >
                        <Route path="settings" element={<SettingsPage />}></Route>
                        <Route path="cropper-list" element={<CropperListPage />}></Route>
                        <Route path="cropper-edit" element={<CropperEditPage />}></Route>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
"use client"
import { HelpCircle, MessageSquare, Star, LogOut, X, Globe, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "next-themes"

interface FloatingDropdownProps {
  isOpen: boolean
  onClose: () => void
  onLogout: () => void
}

export default function FloatingDropdown({ isOpen, onClose, onLogout }: FloatingDropdownProps) {
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const { currentLanguage, setLanguage, t } = useLanguage()
  const { resolvedTheme, setTheme } = useTheme()

  const languages = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
    { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
    { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
    { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
    { code: "te", name: "Telugu", nativeName: "తెలుగు" },
    { code: "mr", name: "Marathi", nativeName: "मराठी" },
    { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
    { code: "bn", name: "Bengali", nativeName: "বাংলা" },
    { code: "tcy", name: "Tulu", nativeName: "ತುಳು" },
  ]

  const handleLanguageSelect = (languageCode: string) => {
    setLanguage(languageCode)
    setShowLanguageMenu(false)
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={onClose} />

      <div
        className={`fixed top-16 right-4 w-64 floating-dropdown rounded-2xl z-50 transform transition-all duration-300 ease-out ${
          isOpen ? "open scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-popover-foreground">Quick Actions</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-2">
            <Button
              variant="ghost"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="w-full justify-start text-left p-4 h-auto text-popover-foreground hover:bg-card hover:text-card-foreground rounded-xl transition-all duration-200"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-5 w-5 mr-3 text-accent" />
              ) : (
                <Moon className="h-5 w-5 mr-3 text-accent" />
              )}
              <span>{resolvedTheme === "dark" ? "Light mode" : "Dark mode"}</span>
            </Button>

            <Button
              variant="ghost"
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="w-full justify-start text-left p-4 h-auto text-popover-foreground hover:bg-card hover:text-card-foreground rounded-xl transition-all duration-200"
            >
              <Globe className="h-5 w-5 mr-3 text-accent" />
              <div className="flex-1">
                <span>{t("language")}</span>
                <div className="text-xs text-muted-foreground mt-1">
                  {languages.find((lang) => lang.code === currentLanguage)?.nativeName}
                </div>
              </div>
            </Button>

            {showLanguageMenu && (
              <div className="ml-4 space-y-1 max-h-48 overflow-y-auto">
                {languages.map((language) => (
                  <Button
                    key={language.code}
                    variant="ghost"
                    onClick={() => handleLanguageSelect(language.code)}
                    className={`w-full justify-start text-left p-3 h-auto text-sm rounded-lg transition-all duration-200 ${
                      currentLanguage === language.code
                        ? "bg-primary text-primary-foreground"
                        : "text-popover-foreground hover:bg-muted"
                    }`}
                  >
                    <div>
                      <div className="font-medium">{language.nativeName}</div>
                      <div className="text-xs opacity-70">{language.name}</div>
                    </div>
                  </Button>
                ))}
              </div>
            )}

            <Button
              variant="ghost"
              className="w-full justify-start text-left p-4 h-auto text-popover-foreground hover:bg-card hover:text-card-foreground rounded-xl transition-all duration-200"
            >
              <HelpCircle className="h-5 w-5 mr-3 text-accent" />
              <span>Need help?</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start text-left p-4 h-auto text-popover-foreground hover:bg-card hover:text-card-foreground rounded-xl transition-all duration-200"
            >
              <MessageSquare className="h-5 w-5 mr-3 text-accent" />
              <span>Feedback</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start text-left p-4 h-auto text-popover-foreground hover:bg-card hover:text-card-foreground rounded-xl transition-all duration-200"
            >
              <Star className="h-5 w-5 mr-3 text-accent" />
              <span>Leave us a review</span>
            </Button>
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <Button
              variant="ghost"
              onClick={onLogout}
              className="w-full justify-start text-left p-4 h-auto text-destructive hover:text-destructive-foreground hover:bg-destructive rounded-xl transition-all duration-200"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

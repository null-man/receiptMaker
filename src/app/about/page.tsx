"use client";

import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LanguageSelector from "@/components/LanguageSelector";
import I18nProvider from "@/components/I18nProvider";

export default function AboutPage() {
  const { t } = useTranslation('common');

  return (
    <I18nProvider>
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer">
                {t('nav.title')}
              </h1>
            </Link>
          </div>
          <nav className="flex items-center space-x-4">
            <LanguageSelector />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
              {t('about.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('about.subtitle')}
            </p>
          </div>

          {/* About Content */}
          <div className="max-w-4xl mx-auto space-y-8">
            {/* What is Receipt Generator */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t('about.whatIs.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {t('about.whatIs.paragraph1')}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t('about.whatIs.paragraph2')}
                </p>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t('about.features.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">🧾 {t('about.features.templates.title')}</h3>
                    <p className="text-muted-foreground">
                      {t('about.features.templates.description')}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">🎨 {t('about.features.preview.title')}</h3>
                    <p className="text-muted-foreground">
                      {t('about.features.preview.description')}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">🖨️ {t('about.features.print.title')}</h3>
                    <p className="text-muted-foreground">
                      {t('about.features.print.description')}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">🌍 {t('about.features.multilang.title')}</h3>
                    <p className="text-muted-foreground">
                      {t('about.features.multilang.description')}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">💱 {t('about.features.multicurrency.title')}</h3>
                    <p className="text-muted-foreground">
                      {t('about.features.multicurrency.description')}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">📱 {t('about.features.responsive.title')}</h3>
                    <p className="text-muted-foreground">
                      {t('about.features.responsive.description')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Use Cases */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t('about.useCases.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center space-y-3">
                    <div className="text-4xl">🏪</div>
                    <h3 className="font-semibold">{t('about.useCases.retail.title')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('about.useCases.retail.description')}
                    </p>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="text-4xl">🍽️</div>
                    <h3 className="font-semibold">{t('about.useCases.foodService.title')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('about.useCases.foodService.description')}
                    </p>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="text-4xl">💼</div>
                    <h3 className="font-semibold">{t('about.useCases.serviceIndustry.title')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('about.useCases.serviceIndustry.description')}
                    </p>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="text-4xl">📚</div>
                    <h3 className="font-semibold">{t('about.useCases.education.title')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('about.useCases.education.description')}
                    </p>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="text-4xl">🎭</div>
                    <h3 className="font-semibold">{t('about.useCases.filmProduction.title')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('about.useCases.filmProduction.description')}
                    </p>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="text-4xl">📊</div>
                    <h3 className="font-semibold">{t('about.useCases.financial.title')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('about.useCases.financial.description')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Why Choose Us */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t('about.whyChoose.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-green-500 mt-1">✓</div>
                    <div>
                      <h4 className="font-semibold">{t('about.whyChoose.free.title')}</h4>
                      <p className="text-muted-foreground text-sm">{t('about.whyChoose.free.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-green-500 mt-1">✓</div>
                    <div>
                      <h4 className="font-semibold">{t('about.whyChoose.easyToUse.title')}</h4>
                      <p className="text-muted-foreground text-sm">{t('about.whyChoose.easyToUse.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-green-500 mt-1">✓</div>
                    <div>
                      <h4 className="font-semibold">{t('about.whyChoose.professional.title')}</h4>
                      <p className="text-muted-foreground text-sm">{t('about.whyChoose.professional.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-green-500 mt-1">✓</div>
                    <div>
                      <h4 className="font-semibold">{t('about.whyChoose.secure.title')}</h4>
                      <p className="text-muted-foreground text-sm">{t('about.whyChoose.secure.description')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t('about.contact.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {t('about.contact.description')}
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p>📧 {t('about.contact.email')}: <a href="mailto:nullyangweiguang@gmail.com" className="text-blue-600 hover:underline">nullyangweiguang@gmail.com</a></p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-12">
          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <Link href="/">
              <Button variant="ghost" className="text-sm text-muted-foreground hover:text-foreground">
                {t('about.footer.home')}
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" className="text-sm text-muted-foreground hover:text-foreground">
                {t('about.footer.about')}
              </Button>
            </Link>
            <Link href="/terms-and-use">
              <Button variant="ghost" className="text-sm text-muted-foreground hover:text-foreground">
                {t('about.footer.termsAndUse')}
              </Button>
            </Link>
          </div>
          
          {/* Copyright */}
          <div className="text-center text-sm text-muted-foreground">
            {t('about.footer.copyright')}
          </div>
        </div>
      </footer>
    </I18nProvider>
  );
} 
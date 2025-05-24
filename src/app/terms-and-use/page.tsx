"use client";

import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LanguageSelector from "@/components/LanguageSelector";
import I18nProvider from "@/components/I18nProvider";

export default function TermsPage() {
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
              {t('terms.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('terms.subtitle')}
            </p>
          </div>

          {/* Terms Content */}
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Important Notice */}
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-2xl text-orange-800">{t('terms.importantNotice.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-orange-700 font-semibold leading-relaxed">
                  {t('terms.importantNotice.content')}
                </p>
              </CardContent>
            </Card>

            {/* Site Contents, Ownership, and Use Restrictions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t('terms.siteContents.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {t('terms.siteContents.paragraph1')}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t('terms.siteContents.paragraph2')}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t('terms.siteContents.paragraph3')}
                </p>
              </CardContent>
            </Card>

            {/* Disclaimer of Warranty */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t('terms.disclaimerWarranty.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  <strong>{t('terms.disclaimerWarranty.paragraph1')}</strong>
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t('terms.disclaimerWarranty.paragraph2')}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t('terms.disclaimerWarranty.paragraph3')}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t('terms.disclaimerWarranty.paragraph4')}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t('terms.disclaimerWarranty.paragraph5')}
                </p>
              </CardContent>
            </Card>

            {/* Disclaimer of Liability */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t('terms.disclaimerLiability.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  <strong>{t('terms.disclaimerLiability.paragraph1')}</strong>
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t('terms.disclaimerLiability.paragraph2')}
                </p>
              </CardContent>
            </Card>

            {/* Privacy Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t('terms.privacyPolicy.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {t('terms.privacyPolicy.intro')}
                </p>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">{t('terms.privacyPolicy.subscriptionLists.title')}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('terms.privacyPolicy.subscriptionLists.content')}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">{t('terms.privacyPolicy.webServerUsage.title')}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('terms.privacyPolicy.webServerUsage.content')}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">{t('terms.privacyPolicy.cookies.title')}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('terms.privacyPolicy.cookies.content')}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">{t('terms.privacyPolicy.advertisements.title')}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('terms.privacyPolicy.advertisements.content')}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">{t('terms.privacyPolicy.externalLinks.title')}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('terms.privacyPolicy.externalLinks.content')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t('terms.paymentPolicy.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {t('terms.paymentPolicy.intro')}
                </p>

                <div className="space-y-3">
                  <h4 className="font-semibold">{t('terms.paymentPolicy.billingPayment.title')}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('terms.paymentPolicy.billingPayment.content')}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">{t('terms.paymentPolicy.autoRenewal.title')}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>{t('terms.paymentPolicy.autoRenewal.paragraph1')}</strong>
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('terms.paymentPolicy.autoRenewal.paragraph2')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Refund Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t('terms.refundPolicy.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {t('terms.refundPolicy.paragraph1')}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t('terms.refundPolicy.paragraph2')}
                </p>
                <p className="text-muted-foreground leading-relaxed font-semibold">
                  {t('terms.refundPolicy.paragraph3')}
                </p>
              </CardContent>
            </Card>

            {/* API Fair Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t('terms.apiFairUsage.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {t('terms.apiFairUsage.paragraph1')}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t('terms.apiFairUsage.paragraph2')}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t('terms.apiFairUsage.paragraph3')}
                </p>
              </CardContent>
            </Card>

            {/* Terms of Use Revisions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t('terms.termsRevisions.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {t('terms.termsRevisions.paragraph1')}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t('terms.termsRevisions.paragraph2')}
                </p>
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
                {t('terms.footer.home')}
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" className="text-sm text-muted-foreground hover:text-foreground">
                {t('terms.footer.about')}
              </Button>
            </Link>
            <Link href="/terms-and-use">
              <Button variant="ghost" className="text-sm text-muted-foreground hover:text-foreground">
                {t('terms.footer.termsAndUse')}
              </Button>
            </Link>
          </div>
          
          {/* Copyright */}
          <div className="text-center text-sm text-muted-foreground">
            {t('terms.footer.copyright')}
          </div>
        </div>
      </footer>
    </I18nProvider>
  );
} 
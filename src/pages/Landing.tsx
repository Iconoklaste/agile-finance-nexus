
import { Link } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b py-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-md h-8 w-8"></div>
            <span className="text-xl font-bold">Agile Finance</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex">
        <div className="container my-auto grid lg:grid-cols-2 gap-8 py-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Gérez vos projets et vos finances en toute simplicité
              </h1>
              <p className="text-lg text-muted-foreground">
                Une plateforme intégrée pour la gestion de projets, la comptabilité et la collaboration entre professionnels.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/app/dashboard" className="inline-flex items-center">
                Découvrir les fonctionnalités <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold">+50%</p>
                <p className="text-sm text-muted-foreground">Productivité</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">-30%</p>
                <p className="text-sm text-muted-foreground">Temps administratif</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">+5000</p>
                <p className="text-sm text-muted-foreground">Utilisateurs</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Card className="w-full max-w-md shadow-lg">
              <CardHeader>
                <CardTitle>Connexion</CardTitle>
                <CardDescription>
                  Connectez-vous à votre compte Agile Finance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 bg-muted/50">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Agile Finance. Tous droits réservés.
          </p>
          <div className="flex gap-4">
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Conditions d'utilisation
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Politique de confidentialité
            </Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

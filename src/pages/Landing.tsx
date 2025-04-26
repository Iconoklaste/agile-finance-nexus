
import { Link } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart4, ChevronRight, Clock, FileText, Shield, Users2 } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Users2,
    title: "Gestion de projets intuitive",
    description: "Pilotez vos projets et votre équipe en toute simplicité"
  },
  {
    icon: BarChart4,
    title: "Comptabilité simplifiée",
    description: "Suivez vos finances sans prise de tête"
  },
  {
    icon: Clock,
    title: "Gain de temps",
    description: "Automatisez vos tâches administratives"
  }
];

const stats = [
  {
    number: "+50%",
    label: "Productivité"
  },
  {
    number: "-30%",
    label: "Temps administratif"
  },
  {
    number: "+5000",
    label: "Utilisateurs actifs"
  }
];

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
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold !leading-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
                Gérez vos projets et vos finances en toute simplicité
              </h1>
              <p className="text-lg text-muted-foreground">
                Une plateforme intégrée pour la gestion de projets, la comptabilité et la collaboration entre professionnels.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/app/dashboard"
                className="inline-flex items-center bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Découvrir <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-3xl font-bold">{stat.number}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-center text-center p-4 rounded-xl transition-all hover:bg-muted"
                >
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <Card className="w-full max-w-md shadow-lg bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
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

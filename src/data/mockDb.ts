export const mockDb = {
    users: [
        { id: "WK-84930", name: "Sophie", status: "Membre Actif", valid: true, color: "#FF4F30" },
        { id: "WK-11023", name: "Thomas", status: "Membre Actif", valid: true, color: "#FF4F30" },
        { id: "WK-99999", name: "Lucas", status: "Carte Expirée", valid: false, color: "#A0998F" }
    ],
    partners: [
        {
            id: "989",
            name: "Cryotera",
            discount: "Séance de Cryothérapie : 30€ au lieu de 42€",
            category: "Santé",
            lat: 45.171662,
            lng: 5.696027,
            image: "https://wiikard.com/wp-content/uploads/2025/09/cryotera.jpg",
            offerImage: "https://wiikard.com/wp-content/uploads/2025/09/cryotera-offre.jpg",
            address: "8 avenue de Grenoble, Seyssinet-Pariset",
            description: "La séance découverte de Cryothérapie (corps entier) : 30€ au lieu de 42€ soit 12€ d’économies.\n\nExemples concrets :\n• Pack de 5 séances : 161,50€ au lieu de 190€.\n• Pack de 10 séances : 297,50€ au lieu de 350€."
        },
        {
            id: "994",
            name: "Vélo Dayak",
            discount: "-10% sur tout le magasin",
            category: "Sport",
            lat: 45.187851,
            lng: 5.749477,
            image: "https://wiikard.com/wp-content/uploads/2025/09/Velo-Dayak.jpg",
            offerImage: "https://wiikard.com/wp-content/uploads/2025/09/Velo-Dayak-offre.jpg",
            address: "12 avenue Gabriel Péri, Saint-Martin-d'Hères",
            description: "Profitez de -10% sur l'ensemble du magasin. Offre non valable sur les promotions en cours, les vélos, les roues et les prestations de l'atelier."
        },
        {
            id: "1000",
            name: "Mooving Arena",
            discount: "1 séance gratuite ou 1 mois offert",
            category: "Sport",
            lat: 45.228752,
            lng: 5.875858,
            image: "https://wiikard.com/wp-content/uploads/2025/09/Mooving-Arena-logo.jpg",
            offerImage: "https://wiikard.com/wp-content/uploads/2025/09/Mooving-Arena-offre.jpg",
            address: "622 Rue Amable Matussière, Le Versoud",
            description: "Choisissez entre 1 séance de 45 minutes gratuite sur l'activité de votre choix ou 1 mois d'abonnement offert pour tout abonnement annuel. Offre valable une seule fois par carte."
        },
        {
            id: "1024",
            name: "BAM Freesports",
            discount: "1 place achetée = 1 place offerte",
            category: "Loisirs",
            lat: 45.151302,
            lng: 5.738857,
            image: "https://wiikard.com/wp-content/uploads/2025/09/Bam-Freesports-logo.jpg",
            offerImage: "https://wiikard.com/wp-content/uploads/2025/09/Bam-Freesports-offre.jpg",
            address: "9 rue E. Galois, Eybens",
            description: "Pour une place achetée, la deuxième vous est offerte. Une économie de 10€ à 21€, valable quelle que soit la date et le type de place."
        },
        {
            id: "1029",
            name: "Bowl Center",
            discount: "Tarifs réduits (Bowling & VR)",
            category: "Loisirs",
            lat: 45.150753,
            lng: 5.716864,
            image: "https://wiikard.com/wp-content/uploads/2025/09/Bowlcenter-logo.jpg",
            offerImage: "https://wiikard.com/wp-content/uploads/2025/09/Bowlcenter-offre.jpg",
            address: "19 avenue de Grugliasco, Echirolles",
            description: "Bowling : 9€ la partie de bowling (chaussures incluses) au lieu de 11,50€.\nOffre Duo 1 partie de Bowling + 1 partie de Réalité Virtuelle : 16€ au lieu de 23€."
        },
        {
            id: "8011",
            name: "Peps Nature",
            discount: "-15% sur tes aventures",
            category: "Loisirs",
            lat: 45.3761108,
            lng: 5.6718621,
            image: "https://wiikard.com/wp-content/uploads/2026/02/peps-nature-logo.jpg",
            offerImage: "https://wiikard.com/wp-content/uploads/2026/02/peps-nature-offre-1.jpg",
            address: "Saint-Joseph-de-Rivière",
            description: "Profitez de -15% de réduction sur toutes tes activités avec Pep's Nature. La remise est valable sur les sorties canyoning, l'escalade, la grimpe d'arbre et les bons cadeaux. Un peu moins cher… mais toujours aussi fun !"
        }
    ]
};
'use client'

import { motion } from 'framer-motion'
import { ShoppingBagIcon, SparklesIcon, GiftIcon } from '@heroicons/react/24/outline'

export default function ProductsPage() {
  const productCategories = [
    {
      name: "Premium Hair Care",
      icon: SparklesIcon,
      brands: ["British Barbers' Association", "Reuzel", "Layrite"],
      products: [
        "Hair & Body Wash",
        "Conditioning Shampoo", 
        "Hair Tonics",
        "Styling Pomades",
        "Hair Grooming Spray",
        "Structure Styling Paste"
      ],
      description: "Professional-grade hair care products from world-renowned brands"
    },
    {
      name: "Shaving Essentials",
      icon: ShoppingBagIcon,
      brands: ["Rockwell Razors", "British Barbers' Association"],
      products: [
        "Safety Razors & Shaving Brushes",
        "Shave Butter & Creams",
        "Pre-Shave Oils",
        "Aftershave Balms",
        "Alum Sticks",
        "Shaving Bowls & Accessories"
      ],
      description: "Complete traditional wet shaving experience with premium tools"
    },
    {
      name: "Beard & Body Care",
      icon: GiftIcon,
      brands: ["Rockwell", "Reuzel", "Layrite"],
      products: [
        "Beard & Body Soap",
        "Beard Oils & Balms",
        "Mustache Wax",
        "Body Lotions",
        "Grooming Tools",
        "Gift Sets"
      ],
      description: "Complete grooming solutions for the modern gentleman"
    }
  ]

  const featuredBrands = [
    {
      name: "Reuzel",
      description: "Traditional barbering with a modern twist. Premium pomades and grooming products.",
      specialty: "Pomades & Hair Tonics"
    },
    {
      name: "British Barbers' Association",
      description: "Professional-grade products trusted by barbers worldwide.",
      specialty: "Complete Hair Care System"
    },
    {
      name: "Layrite",
      description: "Classic American grooming with superior hold and shine.",
      specialty: "Styling Products"
    },
    {
      name: "Rockwell Razors",
      description: "Premium shaving tools and accessories for the perfect shave.",
      specialty: "Shaving Essentials"
    }
  ]

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-salon-dark mb-4">
            Premium Products
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We carry only the finest grooming products from world-renowned brands
          </p>
        </motion.div>

        {/* Product Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {productCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <category.icon className="h-12 w-12 text-salon-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-salon-dark mb-3 text-center">
                {category.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4 text-center">
                {category.description}
              </p>
              
              <div className="mb-4">
                <h4 className="font-semibold text-salon-dark mb-2">Brands:</h4>
                <p className="text-salon-gold text-sm font-medium">
                  {category.brands.join(", ")}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-salon-dark mb-2">Products:</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  {category.products.map((product, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="w-1 h-1 bg-salon-gold rounded-full mr-2"></span>
                      {product}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured Brands */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white p-8 rounded-lg shadow-lg"
        >
          <h3 className="text-2xl font-bold text-salon-dark mb-8 text-center">
            Featured Brands
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBrands.map((brand, index) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h4 className="text-lg font-bold text-salon-dark mb-2">
                  {brand.name}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {brand.description}
                </p>
                <p className="text-xs text-salon-gold font-medium">
                  {brand.specialty}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-bold text-salon-dark mb-4">
            Professional Products Available
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Ask our stylists about the professional products we use and love. 
            Take home the same premium grooming essentials we use in our salon.
          </p>
          <div className="space-x-4">
            <a href="/book" className="btn-primary">
              Book Consultation
            </a>
            <a href="/team" className="btn-secondary">
              Ask Our Team
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

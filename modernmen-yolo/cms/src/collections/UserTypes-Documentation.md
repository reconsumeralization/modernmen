# Modern Men Hair Salon - User Types & Roles

## 📋 Complete User Type System

This document outlines all user types available in the Modern Men Hair Salon management system.

---

## 👑 **Administrative Roles**

### **Owner/CEO**
- **Role Value**: `owner`
- **Description**: Business owner with full system access
- **Permissions**:
  - ✅ Full system access
  - ✅ Manage all users and staff
  - ✅ View all financial reports
  - ✅ Manage all settings and services
  - ✅ Approve all business decisions
- **Special Fields**: Emergency contact, full business metrics access

### **Manager**
- **Role Value**: `manager`
- **Description**: Salon manager overseeing daily operations
- **Permissions**:
  - ✅ Manage customers and appointments
  - ✅ Manage staff scheduling
  - ✅ View financial reports
  - ✅ Manage services and inventory
  - ❌ Cannot manage system settings
- **Special Fields**: Staff management tools, performance metrics

### **System Admin**
- **Role Value**: `admin`
- **Description**: Technical administrator managing system operations
- **Permissions**:
  - ✅ Full technical system access
  - ✅ Manage users and permissions
  - ✅ System configuration and maintenance
  - ✅ Data backup and security
  - ✅ Integration management
- **Special Fields**: API keys, system monitoring tools

---

## 💇‍♂️ **Service Provider Roles**

### **Senior Barber/Stylist**
- **Role Value**: `senior_barber`
- **Description**: Experienced barber/stylist with leadership responsibilities
- **Permissions**:
  - ✅ Book and manage appointments
  - ✅ Manage customer relationships
  - ✅ View personal performance reports
  - ✅ Mentor junior staff
- **Special Fields**:
  - Certifications and licenses
  - Commission rates
  - Performance metrics
  - Mentoring capabilities

### **Barber/Stylist**
- **Role Value**: `barber`
- **Description**: Professional barber/stylist providing hair services
- **Permissions**:
  - ✅ Book and manage appointments
  - ✅ Update customer profiles
  - ✅ View schedule and availability
- **Special Fields**:
  - Specialties and certifications
  - Portfolio and work samples
  - Availability schedule
  - Commission tracking

### **Apprentice/Intern**
- **Role Value**: `apprentice`
- **Description**: Learning barber/stylist under supervision
- **Permissions**:
  - ✅ Book appointments (with supervision)
  - ✅ View training materials
  - ✅ Update personal certifications
- **Special Fields**:
  - Training progress
  - Certification tracking
  - Supervisor assignments
  - Learning objectives

### **Nail Technician**
- **Role Value**: `nail_technician`
- **Description**: Professional nail care specialist
- **Permissions**:
  - ✅ Book and manage nail appointments
  - ✅ Manage nail service inventory
  - ✅ Update customer nail profiles
- **Special Fields**:
  - Nail art portfolio
  - Product certifications
  - Equipment maintenance

### **Esthetician**
- **Role Value**: `esthetician`
- **Description**: Skin care and facial treatment specialist
- **Permissions**:
  - ✅ Book facial and skin treatment appointments
  - ✅ Manage skincare products
  - ✅ Conduct skin consultations
- **Special Fields**:
  - Treatment certifications
  - Skin care product knowledge
  - Consultation protocols

### **Massage Therapist**
- **Role Value**: `massage_therapist`
- **Description**: Professional massage therapy specialist
- **Permissions**:
  - ✅ Book massage appointments
  - ✅ Conduct client consultations
  - ✅ Manage massage equipment
- **Special Fields**:
  - Massage therapy certifications
  - Treatment specializations
  - Client intake forms

---

## 🏢 **Support Staff Roles**

### **Receptionist**
- **Role Value**: `receptionist`
- **Description**: Front desk staff managing customer service
- **Permissions**:
  - ✅ Book and manage all appointments
  - ✅ Manage customer check-in/check-out
  - ✅ Handle customer inquiries
  - ✅ Process payments and refunds
  - ✅ Manage customer profiles
- **Special Fields**:
  - Customer service training
  - Payment processing certifications
  - Communication skills assessment

### **Cleaner/Maintenance**
- **Role Value**: `cleaner`
- **Description**: Cleaning and maintenance staff
- **Permissions**:
  - ✅ View cleaning schedules
  - ✅ Report maintenance issues
  - ✅ Update cleaning checklists
- **Special Fields**:
  - Cleaning certifications
  - Equipment training
  - Safety protocols

### **Inventory Manager**
- **Role Value**: `inventory_manager`
- **Description**: Manages product inventory and supplies
- **Permissions**:
  - ✅ Manage product inventory
  - ✅ Process supply orders
  - ✅ Track product usage
  - ✅ Generate inventory reports
  - ✅ Manage supplier relationships
- **Special Fields**:
  - Inventory management certifications
  - Supplier relationship management
  - Product knowledge database

---

## 👥 **Customer Roles**

### **VIP Customer**
- **Role Value**: `vip_customer`
- **Description**: Premium customer with enhanced privileges
- **Permissions**:
  - ✅ Book appointments with priority
  - ✅ Access VIP services and products
  - ✅ Receive exclusive offers
  - ✅ Dedicated stylist relationships
- **Special Fields**:
  - VIP membership tier
  - Loyalty points balance
  - Preferred stylist assignment
  - Exclusive service access

### **Regular Customer**
- **Role Value**: `customer`
- **Description**: Standard salon customer
- **Permissions**:
  - ✅ Book appointments online
  - ✅ View appointment history
  - ✅ Manage personal profile
  - ✅ Receive promotional offers
- **Special Fields**:
  - Basic loyalty program
  - Appointment preferences
  - Service history

### **Corporate Account**
- **Role Value**: `corporate`
- **Description**: Business account for corporate clients
- **Permissions**:
  - ✅ Book group appointments
  - ✅ Manage multiple employees
  - ✅ Corporate billing and invoicing
  - ✅ Custom service packages
- **Special Fields**:
  - Company information
  - Employee management
  - Corporate billing terms
  - Custom service agreements

---

## 🤝 **Business Partner Roles**

### **Supplier/Vendor**
- **Role Value**: `supplier`
- **Description**: Product and service suppliers
- **Permissions**:
  - ✅ View order history
  - ✅ Update product catalog
  - ✅ Manage delivery schedules
  - ✅ Access supplier portal
- **Special Fields**:
  - Supplier type (hair products, equipment, etc.)
  - Payment terms and conditions
  - Product catalog management
  - Performance metrics

### **Marketing Partner**
- **Role Value**: `marketing_partner`
- **Description**: Marketing and promotional partners
- **Permissions**:
  - ✅ Access marketing analytics
  - ✅ Manage promotional campaigns
  - ✅ View customer demographics
  - ✅ Coordinate events and promotions
- **Special Fields**:
  - Marketing campaign management
  - Partnership agreements
  - Performance tracking
  - Content collaboration tools

---

## 🔐 **User Status Types**

All users can have one of the following statuses:
- **✅ Active**: Full access to all permitted features
- **⏸️ Inactive**: Temporary suspension of access
- **🚫 Suspended**: Access suspended pending review
- **🔒 Banned**: Permanent access restriction
- **⏳ Pending Approval**: New user awaiting approval

---

## 🏷️ **User Type Classifications**

Users are also classified by account type:
- **👤 Individual**: Single person account
- **🏢 Business/Corporate**: Business entity account
- **🏪 Salon Franchise**: Multi-location franchise account
- **📦 Supplier/Vendor**: Supplier/vendor account

---

## 🎯 **Permission Matrix**

| Role | Book Appts | Manage Customers | Manage Staff | View Reports | Manage Inventory | Manage Services | Manage Settings | View Financials |
|------|------------|------------------|--------------|--------------|------------------|-----------------|-----------------|-----------------|
| Owner | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manager | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Senior Barber | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Barber | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Receptionist | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Inventory Manager | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Customer | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 🔧 **Implementation Notes**

- **Conditional Fields**: Many fields only appear based on user role
- **Default Permissions**: Automatically assigned based on role selection
- **Access Control**: Role-based permissions enforced throughout the system
- **Audit Trail**: All user changes tracked with created/updated by fields
- **Email Verification**: Required for all user accounts
- **Multi-tenant Ready**: Supports multiple salon locations/franchises

---

## 📊 **Database Schema**

The user collection includes comprehensive fields for each user type:
- Basic information (name, email, phone, avatar)
- Role and permissions management
- Role-specific conditional fields
- Employment and certification tracking
- Customer loyalty and preferences
- Business relationship management
- Audit and security fields

This comprehensive user type system provides flexibility for different salon business models while maintaining security and operational efficiency.

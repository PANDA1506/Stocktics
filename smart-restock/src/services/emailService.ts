interface EmailData {
  to: string;
  subject: string;
  body: string;
  type: 'contact' | 'schedule' | 'order';
}

interface ContactEmailData {
  productName: string;
  shelf: string;
  urgency: string;
  prediction: string;
  vendorName: string;
}

interface ScheduleEmailData {
  productName: string;
  shelf: string;
  date: string;
  time: string;
  priority: string;
  assignedTo: string;
  notes: string;
}

interface OrderEmailData {
  productName: string;
  shelf: string;
  quantity: number;
  urgency: string;
  estimatedDelivery: string;
}

// Simulate email sending (in real app, this would integrate with email service)
const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  console.log('Sending email:', emailData);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate 95% success rate
  return Math.random() > 0.05;
};

export const sendContactEmail = async (data: ContactEmailData): Promise<boolean> => {
  const emailData: EmailData = {
    to: getVendorEmail(data.vendorName),
    subject: `Restock Request - ${data.productName} (Priority: ${data.urgency.toUpperCase()})`,
    body: `
      Dear ${data.vendorName} Team,

      We need to restock the following item:

      Product: ${data.productName}
      Location: Shelf ${data.shelf}
      Priority Level: ${data.urgency.toUpperCase()}
      AI Analysis: ${data.prediction}

      Please confirm availability and expected delivery time for this restock request.

      Thank you for your prompt attention to this matter.

      Best regards,
      SmartRestock System
      Store #1247
    `,
    type: 'contact'
  };

  return await sendEmail(emailData);
};

export const sendScheduleEmail = async (data: ScheduleEmailData): Promise<boolean> => {
  const emailData: EmailData = {
    to: getTeamMemberEmail(data.assignedTo),
    subject: `Restock Schedule: ${data.productName} - ${data.date}`,
    body: `
      Hello,

      You have been assigned a restock task:

      Product: ${data.productName}
      Location: Shelf ${data.shelf}
      Scheduled Date: ${data.date}
      Scheduled Time: ${data.time}
      Priority: ${data.priority.toUpperCase()}
      
      ${data.notes ? `Additional Notes: ${data.notes}` : ''}

      Please ensure this task is completed on time.

      Best regards,
      SmartRestock System
    `,
    type: 'schedule'
  };

  return await sendEmail(emailData);
};

export const sendOrderConfirmationEmail = async (data: OrderEmailData): Promise<boolean> => {
  const emailData: EmailData = {
    to: 'inventory@store.com',
    subject: `Auto-Order Placed: ${data.productName}`,
    body: `
      An automatic order has been placed:

      Product: ${data.productName}
      Location: Shelf ${data.shelf}
      Quantity: ${data.quantity} units
      Urgency: ${data.urgency.toUpperCase()}
      Estimated Delivery: ${data.estimatedDelivery}

      Order will be tracked in the delivery section.

      SmartRestock System
    `,
    type: 'order'
  };

  return await sendEmail(emailData);
};

// Helper function to get vendor email addresses
const getVendorEmail = (vendorName: string): string => {
  const vendorEmails: { [key: string]: string } = {
    'Coca Cola Distributor': 'orders@cocacola-dist.com',
    'Wonder Bread Supplier': 'restock@wonderbread.com',
    'P&G Products': 'wholesale@pg.com',
    'Fresh Produce Co': 'orders@freshproduce.com',
    'Dairy Supply Chain': 'urgent@dairychain.com',
    'Frito-Lay Distribution': 'restock@fritolay.com',
    'General Mills': 'orders@generalmills.com',
    'Electronics Wholesale': 'tech@electronicswholesale.com',
    'Britannia Industries': 'orders@britannia.com',
    'Parle Products': 'supply@parle.com',
    'Amul Dairy': 'restock@amul.com',
    'Tata Consumer Products': 'orders@tata.com',
    "Haldiram's": 'wholesale@haldirams.com',
    'Patanjali Ayurved': 'orders@patanjali.com'
  };
  return vendorEmails[vendorName] || 'vendor@example.com';
};

const getTeamMemberEmail = (teamMember: string): string => {
  const teamEmails: { [key: string]: string } = {
    'john': 'john.smith@store.com',
    'sarah': 'sarah.johnson@store.com',
    'mike': 'mike.davis@store.com',
    'lisa': 'lisa.wilson@store.com'
  };
  return teamEmails[teamMember] || 'team@store.com';
};

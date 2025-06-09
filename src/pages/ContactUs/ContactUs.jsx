import { Helmet } from 'react-helmet-async';
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ContactUs = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent! We will get back to you soon.');
    e.target.reset();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Helmet><title>Contact Us | ReSell Hub</title></Helmet>
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Get In Touch</h1>
        <p className="text-gray-500 mt-3">Have questions? We'd love to hear from you.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          {[
            { icon: <FiMapPin />, title: 'Address', text: 'Dhaka, Bangladesh' },
            { icon: <FiPhone />, title: 'Phone', text: '+880 1700-000000' },
            { icon: <FiMail />, title: 'Email', text: 'support@resellhub.com' },
            { icon: <FiClock />, title: 'Hours', text: 'Sat - Thu, 9AM - 6PM' },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl">{item.icon}</div>
              <div>
                <p className="font-semibold text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-600">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-8 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input required placeholder="Your Name" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            <input required type="email" placeholder="Your Email" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          <input required placeholder="Subject" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          <textarea required rows={6} placeholder="Your Message" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" />
          <button type="submit" className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;

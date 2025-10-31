import React from 'react';

export default function ContactPage(){
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Contact Us</h1>
        <p className="text-gray-700 mb-6">Have a question or need support? Reach out and we'll respond as soon as possible.</p>

        <form className="space-y-4" onSubmit={(e)=>{e.preventDefault(); alert('Message sent')}}>
          <input className="w-full p-3 border rounded" placeholder="Your name" required />
          <input className="w-full p-3 border rounded" placeholder="Your email" type="email" required />
          <textarea className="w-full p-3 border rounded" rows={6} placeholder="Message" required />
          <button className="px-6 py-3 bg-purple-700 text-white rounded">Send Message</button>
        </form>
      </div>
    </div>
  );
}

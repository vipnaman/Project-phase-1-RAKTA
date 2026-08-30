const faqs = [
  { question: 'How does matching work?', answer: 'RAKTA considers blood group compatibility, city, availability, urgency, and recent donor activity to rank possible matches.' },
  { question: 'Is my exact location shown publicly?', answer: 'No. The platform keeps donor details private and only shares contact information through a secure request flow once consent is given.' },
  { question: 'Can I request blood for someone else?', answer: 'Yes. Requesters can create a request on behalf of a patient while maintaining required contact and medical details.' },
];

export default function FAQPage() {
  return (
    <main className="container-shell py-16">
      <div className="mb-8 text-center">
        <div className="text-xs uppercase tracking-[0.2em] text-red-300">FAQ</div>
        <h1 className="mt-2 text-4xl font-black uppercase tracking-[-0.05em] text-white">Frequently asked questions</h1>
      </div>

      <div className="mx-auto max-w-4xl space-y-5">
        {faqs.map((faq) => (
          <div key={faq.question} className="panel p-6">
            <div className="text-xl font-bold text-white">{faq.question}</div>
            <p className="mt-3 text-slate-300">{faq.answer}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

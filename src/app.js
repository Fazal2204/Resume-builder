import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
// Import icons from the lucide-react library
import { User, Mail, Phone, Globe, Briefcase, GraduationCap, Lightbulb, Code, Trash2, PlusCircle, Send, Bot, FileUp, BrainCircuit, Download, HandHeart, Zap } from 'lucide-react';
// Import PDF generation libraries
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


// --- Reusable UI Components ---

function Input({ icon, label, name, value, onChange, placeholder }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {icon}
        </div>
        <input
          type="text"
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-md border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

function Textarea({ label, name, value, onChange, placeholder, rows = 4 }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-md border-gray-200 bg-gray-50 p-3 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </div>
  );
}

function Button({ children, onClick, type = 'button', variant = 'primary', disabled = false, icon: Icon }) {
  const baseClasses = "flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ease-in-out transform hover:scale-105";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    tertiary: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    ghost: "bg-transparent text-gray-500 hover:bg-gray-100 hover:text-red-500"
  };
  return (
    <button type={type} onClick={onClick} className={`${baseClasses} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}`} disabled={disabled}>
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
}

function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-3 mb-6 border-b pb-4">
      {icon}
      <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
    </div>
  );
}


// --- Main Application Components ---

function Header() {
  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow-lg sticky top-0 z-10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <BrainCircuit size={28} />
            <span>AI Resume Builder</span>
          </div>
          <nav className="hidden md:flex items-center gap-2">
            <a href="#editor" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Editor</a>
            <a href="#chatbot" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">AI Assistant</a>
          </nav>
        </div>
      </div>
    </header>
  );
}

function ResumeEditor({ resumeData, setResumeData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setResumeData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSectionChange = (section, index, e) => {
    const { name, value } = e.target;
    const updatedSection = [...resumeData[section]];
    updatedSection[index] = { ...updatedSection[index], [name]: value };
    setResumeData(prevData => ({ ...prevData, [section]: updatedSection }));
  };
  
  const handleAddItem = (section, item) => {
    setResumeData(prevData => ({
      ...prevData,
      [section]: [...prevData[section], item]
    }));
  };

  const handleRemoveItem = (section, index) => {
    const updatedSection = resumeData[section].filter((_, i) => i !== index);
    setResumeData(prevData => ({ ...prevData, [section]: updatedSection }));
  };

  const handleExportPDF = () => {
    const resumeElement = document.getElementById('resume-preview');
    if (!resumeElement) {
        console.error("Resume preview element not found!");
        return;
    }

    html2canvas(resumeElement, {
        scale: 2,
        useCORS: true
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${resumeData.fullName || 'resume'}.pdf`);
    });
  };

  return (
    <div id="editor" className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800">Resume Editor</h2>
        <Button onClick={handleExportPDF} icon={Download}>Export PDF</Button>
      </div>
      <form className="space-y-10">
        <section>
          <SectionHeader icon={<User className="text-blue-600" size={28} />} title="Personal Details" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input icon={<User size={16} className="text-gray-400" />} label="Full Name" name="fullName" value={resumeData.fullName} onChange={handleChange} placeholder="Jane Doe" />
            <Input icon={<Mail size={16} className="text-gray-400" />} label="Email Address" name="email" value={resumeData.email} onChange={handleChange} placeholder="jane.doe@example.com" />
            <Input icon={<Phone size={16} className="text-gray-400" />} label="Phone Number" name="phone" value={resumeData.phone} onChange={handleChange} placeholder="(123) 456-7890" />
            <Input icon={<Globe size={16} className="text-gray-400" />} label="Website / Portfolio" name="website" value={resumeData.website} onChange={handleChange} placeholder="github.com/janedoe" />
          </div>
        </section>

        <section>
          <SectionHeader icon={<Lightbulb className="text-blue-600" size={28} />} title="Professional Summary" />
          <Textarea label="Summary" name="summary" value={resumeData.summary} onChange={handleChange} placeholder="A brief 2-3 sentence summary..." />
        </section>
        
        <section>
          <SectionHeader icon={<GraduationCap className="text-blue-600" size={28} />} title="Education" />
          <div className="space-y-6">
             {resumeData.education.map((edu, index) => (
              <div key={index} className="bg-gray-50 p-6 border border-gray-200 rounded-lg relative space-y-4">
                <Input label="Degree / Certificate" name="degree" value={edu.degree} onChange={(e) => handleSectionChange('education', index, e)} placeholder="B.S. in Computer Science" />
                <Input label="Institution" name="institution" value={edu.institution} onChange={(e) => handleSectionChange('education', index, e)} placeholder="University of Technology" />
                <Input label="Graduation Date" name="date" value={edu.date} onChange={(e) => handleSectionChange('education', index, e)} placeholder="May 2019" />
                 <div className="absolute top-4 right-4">
                   <Button onClick={() => handleRemoveItem('education', index)} variant="ghost" icon={Trash2} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Button onClick={() => handleAddItem('education', { degree: '', institution: '', date: '' })} icon={PlusCircle}>
              Add Education
            </Button>
          </div>
        </section>

        <section>
          <SectionHeader icon={<Briefcase className="text-blue-600" size={28} />} title="Work Experience" />
          <div className="space-y-6">
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="bg-gray-50 p-6 border border-gray-200 rounded-lg relative space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Job Title" name="title" value={exp.title} onChange={(e) => handleSectionChange('experience', index, e)} placeholder="Software Engineer" />
                    <Input label="Company" name="company" value={exp.company} onChange={(e) => handleSectionChange('experience', index, e)} placeholder="Tech Solutions Inc." />
                    <Input label="Location" name="location" value={exp.location} onChange={(e) => handleSectionChange('experience', index, e)} placeholder="San Francisco, CA" />
                    <Input label="Dates" name="dates" value={exp.dates} onChange={(e) => handleSectionChange('experience', index, e)} placeholder="Jan 2020 - Present" />
                </div>
                <Textarea label="Responsibilities" name="responsibilities" value={exp.responsibilities} onChange={(e) => handleSectionChange('experience', index, e)} placeholder="Describe your key achievements..." />
                <div className="absolute top-4 right-4">
                   <Button onClick={() => handleRemoveItem('experience', index)} variant="ghost" icon={Trash2} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Button onClick={() => handleAddItem('experience', { title: '', company: '', location: '', dates: '', responsibilities: '' })} icon={PlusCircle}>
              Add Experience
            </Button>
          </div>
        </section>

        <section>
          <SectionHeader icon={<HandHeart className="text-blue-600" size={28} />} title="Volunteer Experience" />
          <div className="space-y-6">
            {resumeData.volunteer.map((vol, index) => (
              <div key={index} className="bg-gray-50 p-6 border border-gray-200 rounded-lg relative space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Role" name="role" value={vol.role} onChange={(e) => handleSectionChange('volunteer', index, e)} placeholder="Event Coordinator" />
                    <Input label="Organization" name="organization" value={vol.organization} onChange={(e) => handleSectionChange('volunteer', index, e)} placeholder="Community Outreach" />
                    <Input label="Location" name="location" value={vol.location} onChange={(e) => handleSectionChange('volunteer', index, e)} placeholder="New York, NY" />
                    <Input label="Dates" name="dates" value={vol.dates} onChange={(e) => handleSectionChange('volunteer', index, e)} placeholder="Summer 2019" />
                </div>
                <Textarea label="Description" name="description" value={vol.description} onChange={(e) => handleSectionChange('volunteer', index, e)} placeholder="Describe your contributions..." />
                <div className="absolute top-4 right-4">
                   <Button onClick={() => handleRemoveItem('volunteer', index)} variant="ghost" icon={Trash2} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Button onClick={() => handleAddItem('volunteer', { role: '', organization: '', location: '', dates: '', description: '' })} icon={PlusCircle}>
              Add Volunteer Role
            </Button>
          </div>
        </section>

        <section>
          <SectionHeader icon={<Zap className="text-blue-600" size={28} />} title="Extracurricular Activities" />
          <div className="space-y-6">
            {resumeData.extracurriculars.map((activity, index) => (
              <div key={index} className="bg-gray-50 p-6 border border-gray-200 rounded-lg relative space-y-4">
                <Input label="Activity Name" name="name" value={activity.name} onChange={(e) => handleSectionChange('extracurriculars', index, e)} placeholder="University Coding Club" />
                <Input label="Your Role" name="role" value={activity.role} onChange={(e) => handleSectionChange('extracurriculars', index, e)} placeholder="President / Member" />
                <Textarea label="Description" name="description" value={activity.description} onChange={(e) => handleSectionChange('extracurriculars', index, e)} placeholder="Describe the activity and your involvement..." />
                <div className="absolute top-4 right-4">
                   <Button onClick={() => handleRemoveItem('extracurriculars', index)} variant="ghost" icon={Trash2} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Button onClick={() => handleAddItem('extracurriculars', { name: '', role: '', description: '' })} icon={PlusCircle}>
              Add Activity
            </Button>
          </div>
        </section>

        <section>
          <SectionHeader icon={<Code className="text-blue-600" size={28} />} title="Projects" />
          <div className="space-y-6">
            {resumeData.projects.map((project, index) => (
              <div key={index} className="bg-gray-50 p-6 border border-gray-200 rounded-lg relative space-y-4">
                <Input label="Project Name" name="name" value={project.name} onChange={(e) => handleSectionChange('projects', index, e)} placeholder="AI Resume Builder" />
                <Textarea label="Description" name="description" value={project.description} onChange={(e) => handleSectionChange('projects', index, e)} placeholder="Describe the project..." />
                <Input label="Link" name="link" value={project.link} onChange={(e) => handleSectionChange('projects', index, e)} placeholder="github.com/user/project-repo" />
                <div className="absolute top-4 right-4">
                   <Button onClick={() => handleRemoveItem('projects', index)} variant="ghost" icon={Trash2} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Button onClick={() => handleAddItem('projects', { name: '', description: '', link: '' })} icon={PlusCircle}>
              Add Project
            </Button>
          </div>
        </section>

        <section>
          <SectionHeader icon={<Lightbulb className="text-blue-600" size={28} />} title="Skills" />
          <Textarea 
            label="Skills" 
            name="skills" 
            value={resumeData.skills} 
            onChange={handleChange} 
            placeholder="e.g., JavaScript, React, Node.js, Python, SQL, Git" 
            rows={3}
          />
        </section>
      </form>
    </div>
  );
}

function AIAssistant({ resumeData }) {
    const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! Ask a question, get feedback on the resume you build here, or upload your own for analysis.' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const callGeminiAPI = async (prompt, filePayload = null) => {
    setIsLoading(true);
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY || "AIzaSyAV3IS0q6kMpmmvd0VIrnrq_YCniC1vRYo"; 

    if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
      const errorMsg = "API Key is missing. Please add your Gemini API key to a .env file (REACT_APP_GEMINI_API_KEY=...).";
      setMessages(prev => [...prev, { role: 'ai', text: errorMsg }]);
      setIsLoading(false);
      return;
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    let parts = [{ text: prompt }];
    if (filePayload) {
      parts.push({
        inline_data: {
          mime_type: filePayload.mimeType,
          data: filePayload.data
        }
      });
    }

    const payload = { contents: [{ role: "user", parts: parts }] };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(`API request failed: ${errorBody.error?.message || 'Unknown error'}`);
      }

      const result = await response.json();
      const aiResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (aiResponse) {
        setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
      } else {
        throw new Error("No valid content in AI response.");
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setMessages(prev => [...prev, { role: 'ai', text: `Error: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    const newMessages = [...messages, { role: 'user', text: userInput }];
    setMessages(newMessages);
    const prompt = `You are a helpful and detailed career assistant for students. Your tone is encouraging and professional. Answer the following question thoroughly and provide a comprehensive, elongated response. If applicable, use examples or step-by-step lists. Format your answer using markdown. The user's question is: ${userInput}`;
    callGeminiAPI(prompt);
    setUserInput('');
  };

  const handleGetFeedback = () => {
    const resumeJson = JSON.stringify(resumeData, null, 2);
    const prompt = `You are an expert resume reviewer and career coach. Your tone should be encouraging, professional, and very thorough. Analyze the following resume data, which is in JSON format. Provide a detailed, section-by-section review in a long, "elongated" format. For each section (Summary, Experience, etc.), first praise what is good, then provide specific, actionable suggestions for improvement. Explain the 'why' behind each suggestion to help the user learn. Conclude with a summary of the top 3 most impactful changes the user can make. Format the entire response using markdown for readability.\n\nHere is the resume data:\n\n${resumeJson}`;
    const newMessages = [...messages, { role: 'user', text: "Please give me detailed feedback on the resume I built." }];
    setMessages(newMessages);
    callGeminiAPI(prompt);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleAnalyzeFile = () => {
    if (!uploadedFile) {
      setMessages(prev => [...prev, { role: 'ai', text: "Please upload a file first." }]);
      return;
    }

    console.log("Analyzing file:", uploadedFile.name, "MIME Type:", uploadedFile.type);

    const reader = new FileReader();
    reader.readAsDataURL(uploadedFile);
    reader.onloadend = () => {
      const base64Data = reader.result.split(',')[1];
      const filePayload = {
        mimeType: uploadedFile.type,
        data: base64Data
      };
      
      const prompt = "You are an expert resume reviewer and career coach. Your tone should be encouraging, professional, and very thorough. Analyze this uploaded resume file (which could be an image, PDF, or document). Provide a detailed, section-by-section review in a long, 'elongated' format. For each section you identify, first praise what is good, then provide specific, actionable suggestions for improvement. Explain the 'why' behind each suggestion. Conclude with a summary of the top 3 most impactful changes the user can make. Format the entire response using markdown for readability.";
      
      const newMessages = [...messages, { role: 'user', text: `Reviewing uploaded file: ${uploadedFile.name}` }];
      setMessages(newMessages);
      callGeminiAPI(prompt, filePayload);
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, there was an error reading your file." }]);
    };
  };

  return (
    <div id="chatbot" className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 flex flex-col h-full">
      <SectionHeader icon={<Bot className="text-blue-600" size={28} />} title="AI Assistant" />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/*,application/pdf,.doc,.docx"
      />
      
      <div ref={chatContainerRef} className="flex-grow overflow-y-auto mb-4 -mr-4 pr-4 space-y-4 min-h-96">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'ai' && <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0"></div>}
            <div className={`p-4 rounded-lg max-w-lg break-words ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
              {msg.role === 'ai' ? (
                <div className="prose prose-sm max-w-none text-gray-800">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3 justify-start">
             <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0"></div>
            <div className="bg-gray-100 text-gray-800 p-4 rounded-lg rounded-bl-none">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-shrink-0 border-t pt-6 mt-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button onClick={() => fileInputRef.current.click()} disabled={isLoading} variant="tertiary" icon={FileUp}>
            Upload Resume
          </Button>
          <Button onClick={handleAnalyzeFile} disabled={isLoading || !uploadedFile}>
            Analyze Uploaded
          </Button>
        </div>
        {uploadedFile && (
            <div className="text-xs text-center text-gray-500">
              Selected: {uploadedFile.name}
            </div>
        )}
        
        <Button onClick={handleGetFeedback} disabled={isLoading} icon={BrainCircuit}>
          Get Feedback on Built Resume
        </Button>

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask a general question..."
            className="flex-grow rounded-md border-gray-200 bg-gray-50 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading} icon={Send} />
        </form>
      </div>
    </div>
  );
}

function ResumePreview({ resumeData }) {
    return (
        <div id="resume-preview" className="bg-white p-12 font-serif" style={{ width: '210mm', minHeight: '297mm' }}>
            <div className="text-center border-b-2 pb-4 mb-8">
                <h1 className="text-4xl font-bold tracking-wider uppercase">{resumeData.fullName || 'Your Name'}</h1>
                <div className="flex justify-center gap-x-4 gap-y-1 text-sm mt-2 flex-wrap">
                    <span>{resumeData.email || 'your.email@example.com'}</span>
                    <span>|</span>
                    <span>{resumeData.phone || '(123) 456-7890'}</span>
                    {resumeData.website && (
                        <>
                            <span>|</span>
                            <a href={resumeData.website} className="text-blue-600 underline">{resumeData.website}</a>
                        </>
                    )}
                </div>
            </div>

            {resumeData.summary && (
                <section className="mb-8">
                    <h2 className="text-xl font-bold border-b-2 pb-2 mb-3 uppercase tracking-wider">Summary</h2>
                    <p className="text-sm">{resumeData.summary}</p>
                </section>
            )}

            {resumeData.education && resumeData.education.length > 0 && resumeData.education[0].degree && (
                <section className="mb-8">
                    <h2 className="text-xl font-bold border-b-2 pb-2 mb-3 uppercase tracking-wider">Education</h2>
                    {resumeData.education.map((edu, index) => (
                        <div key={index} className="mb-2">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-lg font-bold">{edu.degree || 'Degree'}</h3>
                                <span className="text-sm font-medium">{edu.date || 'Date'}</span>
                            </div>
                            <h4 className="text-md font-semibold italic">{edu.institution || 'Institution'}</h4>
                        </div>
                    ))}
                </section>
            )}

            {resumeData.experience && resumeData.experience.length > 0 && resumeData.experience[0].title && (
                <section className="mb-8">
                    <h2 className="text-xl font-bold border-b-2 pb-2 mb-3 uppercase tracking-wider">Experience</h2>
                    {resumeData.experience.map((exp, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-lg font-bold">{exp.title || 'Job Title'}</h3>
                                <span className="text-sm font-medium">{exp.dates || 'Dates'}</span>
                            </div>
                            <div className="flex justify-between items-baseline mb-1">
                                <h4 className="text-md font-semibold italic">{exp.company || 'Company'}</h4>
                                <span className="text-sm italic">{exp.location || 'Location'}</span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">{exp.responsibilities}</p>
                        </div>
                    ))}
                </section>
            )}

            {resumeData.volunteer && resumeData.volunteer.length > 0 && resumeData.volunteer[0].role && (
                <section className="mb-8">
                    <h2 className="text-xl font-bold border-b-2 pb-2 mb-3 uppercase tracking-wider">Volunteer Experience</h2>
                    {resumeData.volunteer.map((vol, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-lg font-bold">{vol.role || 'Volunteer Role'}</h3>
                                <span className="text-sm font-medium">{vol.dates || 'Dates'}</span>
                            </div>
                            <div className="flex justify-between items-baseline mb-1">
                                <h4 className="text-md font-semibold italic">{vol.organization || 'Organization'}</h4>
                                <span className="text-sm italic">{vol.location || 'Location'}</span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">{vol.description}</p>
                        </div>
                    ))}
                </section>
            )}

            {resumeData.extracurriculars && resumeData.extracurriculars.length > 0 && resumeData.extracurriculars[0].name && (
                <section className="mb-8">
                    <h2 className="text-xl font-bold border-b-2 pb-2 mb-3 uppercase tracking-wider">Extracurricular Activities</h2>
                    {resumeData.extracurriculars.map((activity, index) => (
                        <div key={index} className="mb-4">
                            <h3 className="text-lg font-bold">{activity.name || 'Activity Name'}</h3>
                            <h4 className="text-md font-semibold italic mb-1">{activity.role || 'Role'}</h4>
                            <p className="text-sm whitespace-pre-wrap">{activity.description}</p>
                        </div>
                    ))}
                </section>
            )}

            {resumeData.projects && resumeData.projects.length > 0 && resumeData.projects[0].name && (
                <section className="mb-8">
                    <h2 className="text-xl font-bold border-b-2 pb-2 mb-3 uppercase tracking-wider">Projects</h2>
                    {resumeData.projects.map((proj, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-lg font-bold">{proj.name || 'Project Name'}</h3>
                                {proj.link && <a href={proj.link} className="text-sm text-blue-600 underline">{proj.link}</a>}
                            </div>
                            <p className="text-sm whitespace-pre-wrap">{proj.description}</p>
                        </div>
                    ))}
                </section>
            )}

            {resumeData.skills && (
                <section>
                    <h2 className="text-xl font-bold border-b-2 pb-2 mb-3 uppercase tracking-wider">Skills</h2>
                    <p className="text-sm">{resumeData.skills}</p>
                </section>
            )}
        </div>
    );
}


// --- Main App Component ---
function App() {
  const [resumeData, setResumeData] = useState({
    fullName: '',
    email: '',
    phone: '',
    website: '',
    summary: '',
    experience: [{ title: '', company: '', location: '', dates: '', responsibilities: '' }],
    volunteer: [{ role: '', organization: '', location: '', dates: '', description: '' }],
    extracurriculars: [{ name: '', role: '', description: '' }],
    projects: [{ name: '', description: '', link: '' }],
    education: [{ degree: '', institution: '', date: '' }],
    skills: '',
  });

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <ResumeEditor resumeData={resumeData} setResumeData={setResumeData} />
          <AIAssistant resumeData={resumeData} />
        </div>
      </main>
      <div className="absolute -z-10 -left-[3000px] top-0">
          <ResumePreview resumeData={resumeData} />
      </div>
    </div>
  );
}

export default App;

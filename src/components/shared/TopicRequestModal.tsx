import React, { useState } from 'react';
import { X, Send, Plus } from 'lucide-react';

interface TopicRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TopicRequestModal: React.FC<TopicRequestModalProps> = ({ isOpen, onClose }) => {
  const [topic, setTopic] = useState('');
  const [helpDescription, setHelpDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !helpDescription.trim()) return;

    setIsSubmitting(true);

    try {
      // Create mailto link with form data
      const subject = encodeURIComponent('Node Flow Additional Topic Request');
      const body = encodeURIComponent(
        `Topic Requested: ${topic}\n\nHow this topic would help: ${helpDescription}\n\nSubmitted via Node Flow topic request form.`
      );
      const mailtoLink = `mailto:oliviajardine9@gmail.com?subject=${subject}&body=${body}`;
      
      // Open email client
      window.location.href = mailtoLink;
      
      setIsSubmitted(true);
      setTimeout(() => {
        onClose();
        setIsSubmitted(false);
        setTopic('');
        setHelpDescription('');
      }, 2000);
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTopic('');
    setHelpDescription('');
    setIsSubmitted(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-surface border border-default rounded-2xl shadow-custom-xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-light rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-primary">Request a Topic</h2>
              <p className="text-sm text-secondary">Can't find what you're looking for?</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 bg-surface-elevated hover:bg-accent-light rounded-lg flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-secondary hover:text-accent" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">Request Sent!</h3>
            <p className="text-secondary">Your email client should open with the request. Thank you for your suggestion!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Topic Input */}
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-primary mb-2">
                What topic would you like to see added?
              </label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Red-Black Trees, Dijkstra's Algorithm, etc."
                className="w-full px-4 py-3 bg-surface-elevated border border-subtle rounded-lg text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
                required
              />
            </div>

            {/* Help Description */}
            <div>
              <label htmlFor="help" className="block text-sm font-medium text-primary mb-2">
                How would this topic help you?
              </label>
              <textarea
                id="help"
                value={helpDescription}
                onChange={(e) => setHelpDescription(e.target.value)}
                placeholder="e.g., I'm studying for technical interviews and need to understand this concept better..."
                rows={4}
                className="w-full px-4 py-3 bg-surface-elevated border border-subtle rounded-lg text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors resize-none"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-3 border border-subtle text-secondary rounded-lg font-medium hover:bg-surface-elevated transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !topic.trim() || !helpDescription.trim()}
                className="flex-1 px-4 py-3 bg-accent text-inverse rounded-lg font-medium hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-inverse/30 border-t-inverse rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Request
                  </>
                )}
              </button>
            </div>

            {/* Note */}
            <p className="text-xs text-muted text-center">
              This request is anonymous and will open your email client to send the request.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default TopicRequestModal;

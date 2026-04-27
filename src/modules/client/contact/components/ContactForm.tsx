'use client';

import { useState } from 'react';
import { GuestContactService } from '../services/guest-contact.service';
import { toast } from 'react-hot-toast';
import styles from './ContactForm.module.css';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    setIsSubmitting(true);
    try {
      await GuestContactService.submit(form);
      toast.success('Gửi liên hệ thành công! Chúng tôi sẽ liên hệ bạn sớm nhất.');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gửi liên hệ thất bại. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="cf-name">
            Họ tên <span className={styles.required}>*</span>
          </label>
          <input
            id="cf-name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Nguyễn Văn A"
            className={styles.input}
            required
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="cf-email">
            Email <span className={styles.required}>*</span>
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="email@example.com"
            className={styles.input}
            required
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="cf-phone">
          Số điện thoại
        </label>
        <input
          id="cf-phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="0912 345 678"
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="cf-message">
          Nội dung <span className={styles.required}>*</span>
        </label>
        <textarea
          id="cf-message"
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Viết tin nhắn của bạn..."
          className={styles.textarea}
          rows={4}
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={styles.submitBtn}
      >
        {isSubmitting ? 'Đang gửi...' : 'Gửi liên hệ'}
      </button>
    </form>
  );
}

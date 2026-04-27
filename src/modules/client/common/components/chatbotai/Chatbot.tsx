'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import styles from './Chatbot.module.css';
import {
  ChatbotConfig,
  ChatbotRoom,
  ChatbotQuickReply,
  ChatResponse,
} from '@/modules/admin/chatbot/models/chatbot.model';
import {
  ChatbotService,
  AvailableRoom,
  ProductSuggestion,
} from '@/modules/admin/chatbot/services/chatbot.service';
import { DEFAULT_ROOMS, DEFAULT_QUICK_REPLIES, DEFAULT_WELCOME } from '@/common/utils/chatbot.constants';

const CHATBOT_LOGO_SRC = '/img/logo-AI.png';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  source?: 'qa' | 'ai' | 'fallback';
  rooms?: AvailableRoom[];
  products?: ProductSuggestion[];
}
interface Action { label: string; url?: string | null; type?: string | null; roomId?: string | null; }

const formatPrice = (priceK: number) => `${priceK.toLocaleString('vi-VN')}k`;

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [greeted, setGreeted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: config } = useQuery<ChatbotConfig, Error>({
    queryKey: ['chatbot-config'],
    queryFn: ChatbotService.getConfig,
    staleTime: 1000 * 60 * 10,
  });

  // Fetch live room availability + top products
  const { data: suggestionData } = useQuery({
    queryKey: ['chatbot-suggestions'],
    queryFn: ChatbotService.getSuggestionData,
    staleTime: 1000 * 60 * 5, // refresh every 5 min
  });

  const items: any[] = config?.items?.length ? config.items : [];
  const rooms: ChatbotRoom[] = config?.rooms?.length ? config.rooms : DEFAULT_ROOMS;
  const quickReplies: ChatbotQuickReply[] = config?.quickReplies?.filter((qr) => qr?.isActive) ?? DEFAULT_QUICK_REPLIES;
  const welcomeText = config?.settings?.welcomeText || DEFAULT_WELCOME;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  const handleQuickReply = (qr: ChatbotQuickReply) => {
    const textMap: Record<string, string> = {
      q_book: 'đặt phòng ngay',
      q_room: 'gợi ý phòng theo mood',
      q_hours: 'giờ nhận/trả phòng',
      q_pets: 'có cho thú cưng không',
      q_wifi: 'wifi có sẵn không',
      q_price: 'giá phòng bao nhiêu',
    };
    handleSend(textMap[qr.id] || qr.label);
  };

  const handleAction = (action: Action) => {
    if (action.type === 'faq_hours') { handleSend('giờ nhận/trả phòng'); return; }
    if (action.type === 'faq_price') { handleSend('giá phòng bao nhiêu'); return; }
    if (action.type === 'pick_room' && action.roomId) {
      const room = rooms.find((r) => r.id === action.roomId);
      handleSend(room ? room.name : action.roomId);
      return;
    }
    if (action.url) { window.location.href = action.url; }
  };

  const handleSend = async (text?: string) => {
    const trimmed = (text ?? inputValue).trim();
    if (!trimmed || isTyping) return;

    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setInputValue('');
    setIsTyping(true);

    try {
      const resp: ChatResponse = await ChatbotService.chat(trimmed);

      // Determine if we should show room/product suggestions
      const lowerMsg = trimmed.toLowerCase();
      const shouldShowRooms = lowerMsg.includes('phòng') || lowerMsg.includes('đặt') ||
        lowerMsg.includes('room') || lowerMsg.includes('book') || lowerMsg.includes('gợi');
      const shouldShowProducts = lowerMsg.includes('sản phẩm') || lowerMsg.includes('mua') ||
        lowerMsg.includes('shop') || lowerMsg.includes('product') || lowerMsg.includes('cửa hàng');

      const msgRooms = shouldShowRooms ? (suggestionData?.rooms ?? []) : undefined;
      const msgProducts = shouldShowProducts ? (suggestionData?.products ?? []) : undefined;

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: resp.text,
          source: resp.source,
          rooms: msgRooms,
          products: msgProducts,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Xin lỗi, mình chưa trả lời được lúc này. Bạn thử lại nhé!',
          source: 'fallback',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleOpen = () => {
    if (!isOpen && !greeted) {
      setTimeout(() => {
        const firstMsg: Message = { role: 'assistant', text: welcomeText };
        // Show initial suggestions on open
        const initRooms = (suggestionData?.rooms ?? []).slice(0, 4);
        const initProducts = (suggestionData?.products ?? []).slice(0, 3);
        setMessages([{
          ...firstMsg,
          rooms: initRooms.length ? initRooms : undefined,
          products: initProducts.length ? initProducts : undefined,
        }]);
        setGreeted(true);
      }, 100);
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.widget}>
      <button type="button" className={styles.fab} onClick={toggleOpen} aria-label={isOpen ? 'Đóng chat' : 'Mở trợ lý Another House'}>
        {isOpen ? (
          <span className={styles.fabGlyph}>×</span>
        ) : (
          <Image src={CHATBOT_LOGO_SRC} alt="" width={46} height={46} className={styles.fabLogo} priority />
        )}
      </button>

      {isOpen && (
        <div className={styles.panel}>
          <div className={styles.header}>
            <div className={styles.brand}>
              <div className={styles.avatar}>
                <Image src={CHATBOT_LOGO_SRC} alt="" width={32} height={32} className={styles.avatarImg} />
              </div>
              <div>
                <div className={styles.title}>Another House Assistant</div>
                <div className={styles.subtitle}>Tư vấn đặt phòng & FAQ</div>
              </div>
            </div>
            <button type="button" className={styles.close} onClick={toggleOpen} aria-label="Close chat">×</button>
          </div>

          <div className={styles.messages}>
            {messages.map((msg, i) => (
              <div key={i} className={`${styles.msg} ${styles[msg.role]}`}>
                <div className={styles.bubble}>
                  <div className={styles.bubbleText}>{msg.text}</div>

                  {/* Room suggestions */}
                  {msg.rooms && msg.rooms.length > 0 && (
                    <div className={styles.suggestionSection}>
                      <div className={styles.suggestionTitle}>
                        <span className={styles.suggestionIcon}>🏨</span> Phòng trống
                      </div>
                      <div className={styles.roomCards}>
                        {msg.rooms.map((room) => (
                          <button
                            key={room.concept}
                            type="button"
                            className={styles.roomCard}
                            onClick={() => window.location.href = `/booking?concept=${room.concept}`}
                          >
                            <div className={styles.roomCardImg}>
                              {room.thumbnail ? (
                                <Image
                                  src={room.thumbnail}
                                  alt={room.name}
                                  width={80}
                                  height={60}
                                  className={styles.roomImg}
                                />
                              ) : (
                                <div className={styles.roomImgPlaceholder}>🏨</div>
                              )}
                            </div>
                            <div className={styles.roomCardInfo}>
                              <div className={styles.roomCardName}>{room.name}</div>
                              <div className={styles.roomCardPrice}>{formatPrice(room.price)}</div>
                              {room.available ? (
                                <span className={styles.available}>Còn trống</span>
                              ) : (
                                <span className={styles.unavailable}>Hết phòng</span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        className={styles.viewAllLink}
                        onClick={() => window.location.href = '/booking'}
                      >
                        Xem tất cả phòng →
                      </button>
                    </div>
                  )}

                  {/* Product suggestions */}
                  {msg.products && msg.products.length > 0 && (
                    <div className={styles.suggestionSection}>
                      <div className={styles.suggestionTitle}>
                        <span className={styles.suggestionIcon}>🛍️</span> Sản phẩm nổi bật
                      </div>
                      <div className={styles.productCards}>
                        {msg.products.map((product) => (
                          <button
                            key={product.slug}
                            type="button"
                            className={styles.productCard}
                            onClick={() => window.location.href = `/san-pham/${product.slug}`}
                          >
                            <div className={styles.productCardImg}>
                              {product.thumbnail ? (
                                <Image
                                  src={product.thumbnail}
                                  alt={product.name}
                                  width={60}
                                  height={60}
                                  className={styles.productImg}
                                />
                              ) : (
                                <div className={styles.productImgPlaceholder}>🛍️</div>
                              )}
                            </div>
                            <div className={styles.productCardInfo}>
                              <div className={styles.productCardName}>{product.name}</div>
                              <div className={styles.productCardPrice}>
                                {product.discountPrice ? (
                                  <>
                                    <span className={styles.discountPrice}>
                                      {product.discountPrice.toLocaleString('vi-VN')}đ
                                    </span>
                                    {product.currentPrice && (
                                      <span className={styles.originalPrice}>
                                        {product.currentPrice.toLocaleString('vi-VN')}đ
                                      </span>
                                    )}
                                  </>
                                ) : product.currentPrice ? (
                                  <span>{product.currentPrice.toLocaleString('vi-VN')}đ</span>
                                ) : (
                                  <span>Liên hệ</span>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        className={styles.viewAllLink}
                        onClick={() => window.location.href = '/san-pham'}
                      >
                        Xem tất cả sản phẩm →
                      </button>
                    </div>
                  )}

                  {/* Action buttons */}
                  {msg.source && msg.text && (() => {
                    const lower = msg.text.toLowerCase();
                    if (lower.includes('đặt phòng') || lower.includes('tư vấn')) return (
                      <div className={styles.actionBtns}>
                        <button
                          type="button"
                          className={styles.actionBtnPrimary}
                          onClick={() => window.location.href = '/booking'}
                        >
                          Đặt phòng ngay
                        </button>
                        <button
                          type="button"
                          className={styles.actionBtnSecondary}
                          onClick={() => window.location.href = '/rooms'}
                        >
                          Xem phòng
                        </button>
                      </div>
                    );
                    return null;
                  })()}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className={`${styles.msg} ${styles.assistant}`}>
                <div className={styles.bubble}>
                  <div className={styles.typing}>
                    <span className={styles.dot} /><span className={styles.dot} /><span className={styles.dot} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 0 && !greeted && (
            <div className={styles.quick}>
              {quickReplies.map((chip) => (
                <button key={chip.id} type="button" className={styles.chip} onClick={() => handleQuickReply(chip)}>
                  {chip.label}
                </button>
              ))}
            </div>
          )}

          <div className={styles.inputbar}>
            <div className={styles.inputRow}>
              <input
                ref={inputRef}
                type="text"
                className={styles.input}
                placeholder="Nhắn gì đó… (VD: đặt phòng, giờ nhận/trả, WiFi…)"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                autoComplete="off"
              />
              <button type="button" className={styles.send} onClick={() => handleSend()}>Gửi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;

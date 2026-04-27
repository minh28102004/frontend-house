"use client";

import React, { useState, useEffect } from 'react';
import { useChatbot } from '../hooks/useChatbot';
import {
  ChatbotItemType,
  ChatbotItem,
  ChatbotRoom,
  ChatbotQuickReply,
  ChatbotResponseMode,
} from '../models/chatbot.model';
import {
  App,
  Button,
  Card,
  Empty,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Tabs,
  Typography,
  Switch,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  RobotOutlined,
  RocketOutlined,
  SettingOutlined,
  BarChartOutlined,
  CommentOutlined,
} from '@ant-design/icons';
import { AdminPageHeader, AdminModal } from '@/modules/admin/common/components/AdminUi';
import type { ColumnsType } from 'antd/es/table';

type TabKey = 'items' | 'rooms' | 'quick-replies' | 'settings' | 'stats';

const TYPE_LABELS: Record<ChatbotItemType, string> = {
  [ChatbotItemType.FAQ]: 'Câu hỏi thường gặp',
  [ChatbotItemType.ROOM]: 'Gợi ý phòng',
  [ChatbotItemType.RULE]: 'Quy định',
  [ChatbotItemType.GREETING]: 'Lời chào',
};

const TYPE_COLORS: Record<ChatbotItemType, string> = {
  [ChatbotItemType.FAQ]: 'blue',
  [ChatbotItemType.ROOM]: 'green',
  [ChatbotItemType.RULE]: 'orange',
  [ChatbotItemType.GREETING]: 'purple',
};

const DEFAULT_ROOMS: ChatbotRoom[] = [
  { id: 'romantic', name: 'Romantic', priceK: 990, vibe: 'Warm amber light, intimate evenings, slow mornings.', highlights: ['King size bed', 'Deep soaking tub', 'Private balcony'] },
  { id: 'sky', name: 'Sky', priceK: 890, vibe: 'Airy, cloud-like space with skylight and soft natural light.', highlights: ['Queen size bed', 'Skylight window', 'City view'] },
  { id: 'cinema', name: 'Cinema', priceK: 1090, vibe: 'Velvet cocoon for film nights and immersive audio.', highlights: ['4K Projector', 'Surround sound', 'Curated film library'] },
  { id: 'nature', name: 'Nature', priceK: 940, vibe: 'Living moss, botanical elements, grounding calm.', highlights: ['Living moss wall', 'Soaking tub', 'Garden view'] },
  { id: 'minimal', name: 'Minimal', priceK: 850, vibe: 'Concrete + oak + linen. Quiet, clear, and exactly what you need.', highlights: ['Queen size bed', 'Rain shower', 'Writing desk'] },
];

const DEFAULT_QUICK_REPLIES: ChatbotQuickReply[] = [
  { id: 'q_book', label: 'Đặt phòng ngay', isActive: true, priority: 1 },
  { id: 'q_room', label: 'Gợi ý phòng theo mood', isActive: true, priority: 2 },
  { id: 'q_hours', label: 'Giờ nhận/trả', isActive: true, priority: 3 },
  { id: 'q_pets', label: 'Có cho thú cưng không?', isActive: true, priority: 4 },
  { id: 'q_wifi', label: 'WiFi có sẵn không?', isActive: true, priority: 5 },
  { id: 'q_price', label: 'Giá phòng bao nhiêu?', isActive: true, priority: 6 },
];

export default function ChatbotAdminPage() {
  const { message } = App.useApp();
  const [activeTab, setActiveTab] = useState<TabKey>('items');
  const {
    itemsQuery,
    createMutation,
    updateMutation,
    toggleMutation,
    deleteMutation,
    handleSearch,
    roomsQuery,
    upsertRoomsMutation,
    quickRepliesQuery,
    upsertQuickRepliesMutation,
    settingsQuery,
    updateSettingsMutation,
    statsQuery,
    page,
    setPage,
    searchTerm,
  } = useChatbot();

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ChatbotItem | null>(null);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<Partial<ChatbotItem>>({
    type: ChatbotItemType.FAQ,
    trigger: '',
    response: '',
    actions: [],
    priority: 0,
    isActive: true,
  });

  const [roomsData, setRoomsData] = useState<ChatbotRoom[]>([]);
  const [quickRepliesData, setQuickRepliesData] = useState<ChatbotQuickReply[]>([]);
  const [settingsData, setSettingsData] = useState({
    responseMode: ChatbotResponseMode.AUTO,
    welcomeText: 'Xin chào! Bạn cần mình giúp đặt phòng hay trả lời câu hỏi thường gặp?',
    fallbackToHuman: false,
    aiApiKey: '',
    aiModel: 'gpt-3.5-turbo',
    aiSystemPrompt: '',
  });

  useEffect(() => {
    if (roomsQuery.data) setRoomsData(roomsQuery.data.length ? roomsQuery.data : DEFAULT_ROOMS);
  }, [roomsQuery.data]);

  useEffect(() => {
    if (quickRepliesQuery.data) setQuickRepliesData(quickRepliesQuery.data.length ? quickRepliesQuery.data : DEFAULT_QUICK_REPLIES);
  }, [quickRepliesQuery.data]);

  useEffect(() => {
      if (settingsQuery.data) setSettingsData({
        responseMode: settingsQuery.data.responseMode || ChatbotResponseMode.AUTO,
        welcomeText: settingsQuery.data.welcomeText || 'Xin chào! Bạn cần mình giúp đặt phòng hay trả lời câu hỏi thường gặp?',
        fallbackToHuman: settingsQuery.data.fallbackToHuman ?? false,
        aiApiKey: settingsQuery.data.aiApiKey || '',
        aiModel: settingsQuery.data.aiModel || 'gpt-3.5-turbo',
        aiSystemPrompt: settingsQuery.data.aiSystemPrompt || '',
      });
  }, [settingsQuery.data]);

  const resetForm = () => {
    setFormData({
      type: ChatbotItemType.FAQ,
      trigger: '',
      response: '',
      actions: [],
      priority: 0,
      isActive: true,
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEdit = (item: ChatbotItem) => {
    setFormData({ ...item });
    setEditingItem(item);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!values.trigger?.trim() || !values.response?.trim()) {
        message.error('Từ khóa và câu trả lời không được để trống!');
        return;
      }
      const data = {
        ...values,
        trigger: values.trigger.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim(),
      };
      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem._id, data });
        message.success('Cập nhật thành công!');
      } else {
        await createMutation.mutateAsync(data);
        message.success('Tạo mới thành công!');
      }
      resetForm();
    } catch {
      message.error('Có lỗi xảy ra!');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success('Xóa thành công!');
    } catch {
      message.error('Xóa thất bại!');
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleMutation.mutateAsync(id);
      message.success('Đã cập nhật trạng thái!');
    } catch {
      message.error('Có lỗi!');
    }
  };

  const handleSaveRooms = async () => {
    try {
      await upsertRoomsMutation.mutateAsync(roomsData);
      message.success('Lưu phòng thành công!');
    } catch {
      message.error('Lưu thất bại!');
    }
  };

  const handleSaveQuickReplies = async () => {
    try {
      await upsertQuickRepliesMutation.mutateAsync(quickRepliesData);
      message.success('Lưu quick replies thành công!');
    } catch {
      message.error('Lưu thất bại!');
    }
  };

  const handleSaveSettings = async () => {
    try {
      await updateSettingsMutation.mutateAsync(settingsData);
      message.success('Lưu cài đặt thành công!');
    } catch {
      message.error('Lưu thất bại!');
    }
  };

  const tabItems = [
    {
      key: 'items',
      label: 'Câu hỏi & Trả lời',
      icon: <CommentOutlined />,
      children: (
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Tìm theo từ khóa hoặc câu trả lời…"
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
          />

          <Table
            columns={[
              {
                title: 'Loại',
                dataIndex: 'type',
                key: 'type',
                width: 120,
                render: (type: ChatbotItemType) => (
                  <Tag color={TYPE_COLORS[type]}>{TYPE_LABELS[type]}</Tag>
                ),
              },
              {
                title: 'Từ khóa (trigger)',
                dataIndex: 'trigger',
                key: 'trigger',
                width: 180,
                render: (trigger: string) => (
                  <Typography.Text code className="text-xs">{trigger}</Typography.Text>
                ),
              },
              {
                title: 'Câu trả lời',
                dataIndex: 'response',
                key: 'response',
                render: (response: string) => (
                  <Typography.Text ellipsis={{ tooltip: response }} className="max-w-[300px] block">
                    {response.replace(/<[^>]*>/g, '').substring(0, 100)}
                  </Typography.Text>
                ),
              },
              {
                title: 'Ưu tiên',
                dataIndex: 'priority',
                key: 'priority',
                width: 80,
                align: 'center',
              },
              {
                title: 'Bật',
                dataIndex: 'isActive',
                key: 'isActive',
                width: 80,
                align: 'center',
                render: (isActive: boolean, record: ChatbotItem) => (
                  <Switch
                    checked={isActive}
                    onChange={() => handleToggle(record._id)}
                    size="small"
                  />
                ),
              },
              {
                title: 'Hành động',
                key: 'actions',
                width: 100,
                align: 'center',
                render: (_, record: ChatbotItem) => (
                  <Space size={4}>
                    <Button
                      type="text"
                      shape="circle"
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(record)}
                    />
                    <Button
                      type="text"
                      danger
                      shape="circle"
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(record._id)}
                    />
                  </Space>
                ),
              },
            ] as ColumnsType<ChatbotItem>}
            dataSource={itemsQuery.data?.data || []}
            loading={itemsQuery.isLoading}
            rowKey="_id"
            pagination={{
              current: page,
              pageSize: 10,
              total: itemsQuery.data?.total || 0,
              onChange: setPage,
            }}
          />
        </div>
      ),
    },
    {
      key: 'rooms',
      label: 'Phòng',
      icon: <RobotOutlined />,
      children: (
        <div className="flex flex-col gap-4">
          <Typography.Text type="secondary">Quản lý dữ liệu phòng hiển thị trong chatbot. Thay đổi giá, mô tả, highlights…</Typography.Text>
          {roomsQuery.isLoading ? (
            <div className="text-center py-8 text-gray-500">Đang tải…</div>
          ) : (
            <div className="flex flex-col gap-4">
              {roomsData.map((room, idx) => (
                <Card key={room.id} size="small" className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <Typography.Text strong>{room.name}</Typography.Text>
                    <Typography.Text type="success">{room.priceK.toLocaleString()}k / đêm</Typography.Text>
                  </div>
                  <Form.Item label="Vibe" className="mb-0">
                    <Input.TextArea
                      rows={2}
                      value={room.vibe}
                      onChange={(e) => {
                        const updated = [...roomsData];
                        updated[idx] = { ...updated[idx], vibe: e.target.value };
                        setRoomsData(updated);
                      }}
                    />
                  </Form.Item>
                  <Form.Item label="Highlights (mỗi dòng 1)" className="mb-0">
                    <Input.TextArea
                      rows={3}
                      value={(room.highlights || []).join('\n')}
                      onChange={(e) => {
                        const updated = [...roomsData];
                        updated[idx] = { ...updated[idx], highlights: e.target.value.split('\n').filter(Boolean) };
                        setRoomsData(updated);
                      }}
                    />
                  </Form.Item>
                  <Form.Item label="Giá (k)" className="mb-0">
                    <InputNumber
                      className="w-full"
                      value={room.priceK}
                      onChange={(value) => {
                        const updated = [...roomsData];
                        updated[idx] = { ...updated[idx], priceK: value || 0 };
                        setRoomsData(updated);
                      }}
                    />
                  </Form.Item>
                </Card>
              ))}
              <Button
                type="primary"
                onClick={handleSaveRooms}
                loading={upsertRoomsMutation.isPending}
              >
                Lưu thay đổi
              </Button>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'quick-replies',
      label: 'Quick Replies',
      icon: <RocketOutlined />,
      children: (
        <div className="flex flex-col gap-4">
          <Typography.Text type="secondary">Quản lý các nút gợi ý nhanh hiển thị khi khách mới mở chat.</Typography.Text>
          {quickRepliesQuery.isLoading ? (
            <div className="text-center py-8 text-gray-500">Đang tải…</div>
          ) : (
            <div className="flex flex-col gap-4">
              {quickRepliesData.map((qr, idx) => (
                <Space key={qr.id} align="center" className="w-full">
                  <Switch
                    checked={qr.isActive}
                    onChange={(checked) => {
                      const updated = [...quickRepliesData];
                      updated[idx] = { ...updated[idx], isActive: checked };
                      setQuickRepliesData(updated);
                    }}
                  />
                  <Input
                    className="flex-1"
                    value={qr.label}
                    onChange={(e) => {
                      const updated = [...quickRepliesData];
                      updated[idx] = { ...updated[idx], label: e.target.value };
                      setQuickRepliesData(updated);
                    }}
                  />
                  <InputNumber
                    className="w-20"
                    placeholder="Thứ tự"
                    value={qr.priority}
                    onChange={(value) => {
                      const updated = [...quickRepliesData];
                      updated[idx] = { ...updated[idx], priority: value || 0 };
                      setQuickRepliesData(updated);
                    }}
                  />
                </Space>
              ))}
              <Button
                type="primary"
                onClick={handleSaveQuickReplies}
                loading={upsertQuickRepliesMutation.isPending}
              >
                Lưu thay đổi
              </Button>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'settings',
      label: 'Cài đặt',
      icon: <SettingOutlined />,
      children: (
        <div className="max-w-xl flex flex-col gap-5">
          <Form layout="vertical">
            <Form.Item label="Chế độ phản hồi">
              <Radio.Group
                value={settingsData.responseMode}
                onChange={(e) => setSettingsData({ ...settingsData, responseMode: e.target.value as ChatbotResponseMode })}
              >
                <Space direction="vertical">
                  <Radio value={ChatbotResponseMode.AUTO}>Tự động (AI chatbot trả lời theo Q&A đã cấu hình)</Radio>
                  <Radio value={ChatbotResponseMode.HYBRID}>Hybrid (chatbot trả lời + human có thể can thiệp)</Radio>
                  <Radio value={ChatbotResponseMode.HUMAN}>Human (người thật trả lời — chuyển khách sang chat admin)</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="Câu chào mặc định">
              <Input.TextArea
                rows={3}
                value={settingsData.welcomeText}
                onChange={(e) => setSettingsData({ ...settingsData, welcomeText: e.target.value })}
              />
            </Form.Item>

            <Form.Item>
              <Switch
                checked={settingsData.fallbackToHuman}
                onChange={(checked) => setSettingsData({ ...settingsData, fallbackToHuman: checked })}
              />
              <span className="ml-2">Khi không match từ khóa nào → chuyển khách sang Room Chat (human)</span>
            </Form.Item>

            <div className="border-t pt-6 mt-4">
              <Typography.Title level={5}>Cấu hình AI (GPT)</Typography.Title>

              <Form.Item label="OpenAI API Key (sk-…)" tooltip="Để trống = dùng biến môi trường OPENAI_API_KEY trong .env">
                <Input.Password
                  placeholder="sk-..."
                  value={settingsData.aiApiKey}
                  onChange={(e) => setSettingsData({ ...settingsData, aiApiKey: e.target.value })}
                />
              </Form.Item>

              <Form.Item label="Model AI">
                <Select
                  value={settingsData.aiModel}
                  onChange={(value) => setSettingsData({ ...settingsData, aiModel: value })}
                >
                  <Select.Option value="gpt-4o-mini">GPT-4o mini (nhanh, rẻ)</Select.Option>
                  <Select.Option value="gpt-3.5-turbo">GPT-3.5 Turbo (cũ)</Select.Option>
                  <Select.Option value="gpt-4">GPT-4 (đắt hơn)</Select.Option>
                  <Select.Option value="gpt-4o">GPT-4o (mới nhất)</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="System Prompt tùy chỉnh" tooltip="Để trống = dùng prompt mặc định">
                <Input.TextArea
                  rows={5}
                  placeholder="Bạn là trợ lý AI của Another House..."
                  value={settingsData.aiSystemPrompt}
                  onChange={(e) => setSettingsData({ ...settingsData, aiSystemPrompt: e.target.value })}
                />
              </Form.Item>
            </div>

            <Button
              type="primary"
              onClick={handleSaveSettings}
              loading={updateSettingsMutation.isPending}
            >
              Lưu cài đặt
            </Button>
          </Form>
        </div>
      ),
    },
    {
      key: 'stats',
      label: 'Thống kê',
      icon: <BarChartOutlined />,
      children: (
        <>
          {statsQuery.isLoading ? (
            <div className="text-center py-8 text-gray-500">Đang tải…</div>
          ) : statsQuery.data ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <Statistic title="Tổng tin nhắn" value={statsQuery.data.totalMessages} />
              </Card>
              <Card>
                <Statistic title="Q&A trả lời" value={statsQuery.data.qaReplied} />
              </Card>
              <Card>
                <Statistic title="GPT trả lời" value={statsQuery.data.aiReplied} />
              </Card>
              <Card>
                <Statistic title="Fallback / Human" value={statsQuery.data.fallbackCount + statsQuery.data.humanHandled} />
              </Card>
            </div>
          ) : (
            <Empty description="Chưa có dữ liệu thống kê" />
          )}
        </>
      ),
    },
  ];

  return (
    <div className="ah-admin-page flex flex-col gap-5">
      <AdminPageHeader
        eyebrow="Trợ lý AI"
        title="Quản lý Chatbot"
        description="Cấu hình câu hỏi thường gặp, gợi ý phòng, quick replies và cài đặt AI cho chatbot."
        actions={
          activeTab === 'items' && (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => { resetForm(); setShowForm(true); }}>
              Thêm câu hỏi
            </Button>
          )
        }
      />

      <Card className="ah-admin-card">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as TabKey)}
          items={tabItems}
        />
      </Card>

      <AdminModal
        title={editingItem ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}
        open={showForm}
        onCancel={resetForm}
        onOk={handleSubmit}
        okText={editingItem ? 'Cập nhật' : 'Tạo mới'}
        cancelText="Hủy"
        loading={createMutation.isPending || updateMutation.isPending}
        width={600}
      >
        <Form form={form} layout="vertical" initialValues={formData}>
          <Form.Item
            label="Loại câu hỏi"
            name="type"
            rules={[{ required: true, message: 'Vui lòng chọn loại câu hỏi' }]}
          >
            <Select>
              {Object.values(ChatbotItemType).map((t) => (
                <Select.Option key={t} value={t}>{TYPE_LABELS[t]}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Ưu tiên (số nhỏ = ưu tiên cao)"
            name="priority"
          >
            <InputNumber min={0} className="w-full" />
          </Form.Item>

          <Form.Item
            label="Từ khóa kích hoạt"
            name="trigger"
            rules={[{ required: true, message: 'Vui lòng nhập từ khóa' }]}
            tooltip="Cách nhau bằng dấu |, không dấu. VD: dat phong|booking|datphong"
          >
            <Input placeholder="dat phong|booking|datphong" className="font-mono text-sm" />
          </Form.Item>

          <Form.Item
            label="Câu trả lời"
            name="response"
            rules={[{ required: true, message: 'Vui lòng nhập câu trả lời' }]}
            tooltip="Hỗ trợ xuống dòng"
          >
            <Input.TextArea rows={4} placeholder="Nhập câu trả lời…" />
          </Form.Item>

          <Form.Item name="isActive" valuePropName="checked">
            <Switch /> <span className="ml-2">Bật câu hỏi này</span>
          </Form.Item>
        </Form>
      </AdminModal>
    </div>
  );
}

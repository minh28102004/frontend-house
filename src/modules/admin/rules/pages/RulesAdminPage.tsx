'use client';

import { useEffect, useState } from 'react';
import { App, Button, Card, Statistic, Row, Col, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import toast from '@/common/utils/toast';
import { ruleService, type Rule } from '../services/rule.service';
import RuleForm from '../components/RuleForm';
import RuleList from '../components/RuleList';
import { AdminPageHeader, AdminModal } from '@/modules/admin/common/components/AdminUi';

export default function RulesAdminPage() {
  const { message } = App.useApp();
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const data = await ruleService.getAllAdmin();
      setRules(data);
    } catch (error: unknown) {
      toast.error((error as Error)?.message || 'Lỗi tải danh sách');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleCreate = () => {
    setEditingRule(null);
    setShowForm(true);
  };

  const handleEdit = (rule: Rule) => {
    setEditingRule(rule);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingRule(null);
    fetchRules();
  };

  const handleDelete = async (id: string) => {
    try {
      await ruleService.delete(id);
      message.success('Đã xóa trang');
      fetchRules();
    } catch (error: unknown) {
      message.error((error as Error)?.message || 'Lỗi xóa');
    }
  };

  const handleDragStart = () => {
    // Store drag data if needed
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    const newRules = [...rules];
    const [removed] = newRules.splice(fromIndex, 1);
    newRules.splice(toIndex, 0, removed);

    // Optimistic update
    setRules(newRules);

    try {
      const ids = newRules.map(r => r._id);
      await ruleService.reorder(ids);
      message.success('Đã sắp xếp lại thứ tự');
    } catch (error: unknown) {
      message.error((error as Error)?.message || 'Lỗi sắp xếp');
      fetchRules(); // Revert on error
    }
  };

  const publishedCount = rules.filter(r => r.isPublished).length;

  return (
    <div className="ah-admin-page flex flex-col gap-5">
      <AdminPageHeader
        eyebrow="Nội dung tĩnh"
        title="Quản lý Trang"
        description="Tạo và quản lý các trang: Điều khoản, Chính sách, Hướng dẫn, Nội quy..."
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Tạo trang mới
          </Button>
        }
      />

      {/* Stats */}
      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <Card className="ah-admin-card">
            <Statistic title="Tổng số trang" value={rules.length} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="ah-admin-card">
            <Statistic title="Đã xuất bản" value={publishedCount} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="ah-admin-card">
            <Statistic title="Bản nháp" value={rules.length - publishedCount} />
          </Card>
        </Col>
      </Row>

      {/* Help Text */}
      <Alert
        message="Mẹo quản lý trang"
        description={
          <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
            <li>Kéo thả để sắp xếp thứ tự hiển thị</li>
            <li>Sử dụng SunEditor để viết nội dung với định dạng HTML</li>
            <li>Các trang đã xuất bản sẽ hiển thị ở /rules</li>
          </ul>
        }
        type="info"
        showIcon
      />

      {/* Rule List */}
      <Card className="ah-admin-card">
        <RuleList
          rules={rules}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      </Card>

      {/* Modal Form */}
      <AdminModal
        title={editingRule ? 'Chỉnh sửa trang' : 'Tạo trang mới'}
        open={showForm}
        onCancel={() => { setShowForm(false); setEditingRule(null); }}
        footer={null}
        width={1000}
        destroyOnClose
      >
        <RuleForm
          rule={editingRule}
          onSuccess={handleFormSuccess}
          onClose={() => { setShowForm(false); setEditingRule(null); }}
        />
      </AdminModal>
    </div>
  );
}

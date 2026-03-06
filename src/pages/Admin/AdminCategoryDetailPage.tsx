import categoriesApi from "@/api/categoriesApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Button, Card, Form, Input, Modal, Spin, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";

const AdminCategoryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const categoryId = id ? Number(id) : undefined;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => categoriesApi.getById(categoryId as number),
    enabled: !!categoryId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => categoriesApi.delete(id),

    onSuccess: () => {
      message.success("Xóa danh mục thành công");

      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      navigate("/admin/categories");
    },

    onError: () => {
      message.error("Xóa danh mục thất bại");
    },
  });

  const handleDelete = () => {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa danh mục này?",
      content: "Hành động này không thể hoàn tác",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",

      onOk: () => {
        if (categoryId) {
          deleteMutation.mutate(categoryId);
        }
      },
    });
  };

  if (isLoading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: 100 }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        type="error"
        message="Không thể tải thông tin danh mục"
        description={(error as Error)?.message}
      />
    );
  }

  return (
    <Card
      title="Thông tin danh mục"
      extra={<Button onClick={() => navigate(-1)}>Quay lại</Button>}
    >
      <Form layout="vertical">
        <Form.Item label="Tên">
          <Input value={data?.name} disabled />
        </Form.Item>

        <Form.Item label="Ghi chú">
          <Input value={data?.description} disabled />
        </Form.Item>

        <div style={{ display: "flex", gap: 12 }}>
          <Button
            danger
            loading={deleteMutation.isPending}
            onClick={handleDelete}
          >
            Xóa
          </Button>

          <Button
            type="primary"
            onClick={() => navigate(`/admin/categories/edit/${data?.id}`)}
          >
            Chỉnh sửa
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default AdminCategoryDetailPage;

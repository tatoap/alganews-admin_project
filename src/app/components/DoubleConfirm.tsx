import { Popconfirm } from 'antd';
import confirm from 'antd/lib/modal/confirm';

interface DoubleConfirmProps {
  children: React.ReactNode;
  disabled?: boolean;
  popConfirmTitle: string;
  modalTitle: string;
  modalContent: string;
  onConfirm?: () => void;
}

export default function DoubleConfirm(props: DoubleConfirmProps) {
  return (
    <Popconfirm
      title={props.popConfirmTitle}
      cancelText={'Cancelar'}
      disabled={props.disabled}
      onConfirm={() => {
        confirm({
          title: props.modalTitle,
          cancelText: 'Cancelar',
          content: props.modalContent,
          onOk: props.onConfirm,
        });
      }}
    >
      {props.children}
    </Popconfirm>
  );
}

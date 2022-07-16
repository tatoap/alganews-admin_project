import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  notification,
  Row,
  Select,
  Tabs,
  Upload,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import React, { useCallback, useEffect, useState } from 'react';
import { FileService, User, UserService } from 'tato_ap-sdk';
import ImageCrop from 'antd-img-crop';
import MaskedInput from 'antd-mask-input';
import CustomError from 'tato_ap-sdk/dist/CustomError';
import { Moment } from 'moment';
import { useNavigate } from 'react-router-dom';
import CurrencyInput from '../components/CurrencyInput';

type UserFormType = {
  createdAt: Moment;
  updatedAt: Moment;
  birthdate: Moment;
} & Omit<User.Detailed, 'createdAt' | 'updatedAt' | 'birthdate'>;

interface UserFormProps {
  user?: UserFormType;
  onUpdate?: (user: User.Input) => Promise<any>;
}

export default function UserForm(props: UserFormProps) {
  const navigate = useNavigate();
  const [form] = Form.useForm<User.Input>();
  const [activeTab, setActiveTab] = useState<'personal' | 'bankAccount'>('personal');
  const [avatar, setAvatar] = useState(props.user?.avatarUrls.default || '');
  const [loading, setLoading] = useState(false);
  const [isEditorRole, setIsEditorRole] = useState(props.user?.role === 'EDITOR');

  const handleAvatarUpload = useCallback(async (file: File) => {
    const avatarSource = await FileService.upload(file);
    setAvatar(avatarSource);
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      avatarUrl: avatar || undefined,
    });
  }, [avatar, form]);

  return (
    <Form
      form={form}
      layout='vertical'
      onFinish={async (user: User.Input) => {
        setLoading(true);
        try {
          const userDTO = {
            ...user,
            phone: user.phone.replace(/\D/g, ''),
            taxpayerId: user.taxpayerId.replace(/\D/g, ''),
          };

          if (props.user)
            return props.onUpdate && props.onUpdate(userDTO).finally(() => setLoading(false));

          await UserService.insertNewUser(userDTO);
          navigate('/usuarios', { replace: true });
          notification.success({
            message: 'Sucesso',
            description: 'Usuário criado com sucesso',
          });
        } catch (error) {
          console.log(error);
          if (error instanceof CustomError) {
            if (error.data?.objects) {
              form.setFields(
                error.data.objects.map((error) => {
                  return {
                    name: error.name
                      ?.split(/(\.|\[|\])/gi)
                      .filter((str) => str !== '.' && str !== '[' && str !== ']' && str !== '')
                      .map((str) => (isNaN(Number(str)) ? str : Number(str))) as string[],
                    errors: [error.userMessage],
                  };
                })
              );
            } else {
              notification.error({
                message: error.message,
                description:
                  error.data?.detail === 'Network Error' ? 'Erro de rede' : error.data?.detail,
              });
            }
          } else {
            notification.error({
              message: 'Houve um erro',
            });
          }
        } finally {
          setLoading(false);
        }
      }}
      onFinishFailed={(fields) => {
        let bankAccountErrors = 0;
        let personalDataErrors = 0;

        fields.errorFields.forEach(({ name }) => {
          if (name.includes('bankAccount')) bankAccountErrors++;
          if (
            name.includes('location') ||
            name.includes('skills') ||
            name.includes('phone') ||
            name.includes('taxpayerId') ||
            name.includes('pricePerWords')
          )
            personalDataErrors++;
        });

        if (personalDataErrors >= bankAccountErrors) {
          setActiveTab('personal');
        }

        if (bankAccountErrors > personalDataErrors) {
          setActiveTab('bankAccount');
        }
      }}
      initialValues={props.user}
    >
      <Row gutter={24} align={'middle'}>
        <Col lg={4} xs={24}>
          <Row justify={'center'}>
            <ImageCrop shape={'round'} rotate grid aspect={1}>
              <Upload
                maxCount={1}
                onRemove={() => {
                  setAvatar('');
                }}
                beforeUpload={(file) => {
                  handleAvatarUpload(file);
                  return false;
                }}
                fileList={[
                  ...(avatar
                    ? [
                        {
                          name: 'Avatar',
                          uid: '',
                        },
                      ]
                    : []),
                ]}
              >
                <Avatar
                  icon={<UserOutlined />}
                  style={{ cursor: 'pointer' }}
                  src={avatar}
                  size={128}
                />
              </Upload>
            </ImageCrop>
            <Form.Item name={'avatarUrl'} hidden>
              <Input hidden />
            </Form.Item>
          </Row>
        </Col>
        <Col lg={10} xs={24}>
          <Form.Item
            label={'Nome'}
            name={'name'}
            rules={[
              {
                required: true,
                message: 'O campo é obrigatório',
              },
              {
                max: 255,
                message: 'O nome não pode ter mais de 255 caracteres',
              },
            ]}
          >
            <Input placeholder='E.g.: Renato Ramos' />
          </Form.Item>
          <Form.Item
            label={'Data de nascimento'}
            name={'birthdate'}
            rules={[
              {
                required: true,
                message: 'O campo é obrigatório',
              },
            ]}
          >
            <DatePicker style={{ width: '100%' }} format={'DD/MM/yyyy'} />
          </Form.Item>
        </Col>
        <Col lg={10} xs={24}>
          <Form.Item
            label={'Bio'}
            name={'bio'}
            rules={[
              {
                required: true,
                message: 'O campo é obrigatório',
              },
              {
                max: 255,
                message: 'A biografia não pode ter mais de 255 caracteres',
              },
            ]}
          >
            <Input.TextArea rows={5} />
          </Form.Item>
        </Col>
        <Col lg={24} xs={24}>
          <Divider />
        </Col>
        <Col lg={12} xs={24}>
          <Form.Item
            label={'Perfil do usuário'}
            name={'role'}
            rules={[
              {
                required: true,
                message: 'O campo é obrigatório',
              },
              {
                type: 'enum',
                enum: ['EDITOR', 'ASSISTANT', 'MANAGER'],
                message: 'O perfil do usuário precisa ser editor, assistente ou gerente',
              },
            ]}
          >
            <Select
              placeholder={'Selecione um perfil'}
              onChange={(value) => setIsEditorRole(value === 'EDITOR')}
            >
              <Select.Option value={'EDITOR'}>Editor</Select.Option>
              <Select.Option value={'ASSISTANT'}>Assistente</Select.Option>
              <Select.Option value={'MANAGER'}>Gerente</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col lg={12} xs={24}>
          <Form.Item
            label={'Email'}
            name={'email'}
            rules={[
              {
                required: true,
                message: 'O campo é obrigatório',
              },
              {
                max: 255,
                message: 'O email não pode ter mais de 255 caracteres',
              },
            ]}
          >
            <Input type={'email'} placeholder={'E.g.: contato@renatoramos.com'} />
          </Form.Item>
        </Col>
        <Col lg={24} xs={24}>
          <Divider />
        </Col>
        <Col lg={24}>
          <Tabs
            defaultActiveKey={'personal'}
            activeKey={activeTab}
            onChange={(tab) => setActiveTab(tab as 'personal' | 'bankAccount')}
          >
            <Tabs.TabPane key={'personal'} tab={'Dados pessoais'}>
              <Row gutter={24}>
                <Col lg={8} xs={24}>
                  <Form.Item
                    label={'País'}
                    name={['location', 'country']}
                    rules={[
                      {
                        required: true,
                        message: 'O campo é obrigatório',
                      },
                      {
                        max: 50,
                        message: 'O país não pode ter mais de 50 caracteres',
                      },
                    ]}
                  >
                    <Input placeholder='E.g.: Brasil' />
                  </Form.Item>
                </Col>
                <Col lg={8} xs={24}>
                  <Form.Item
                    label={'Estado'}
                    name={['location', 'state']}
                    rules={[
                      {
                        required: true,
                        message: 'O campo é obrigatório',
                      },
                      {
                        max: 50,
                        message: 'O estado não pode ter mais de 50 caracteres',
                      },
                    ]}
                  >
                    <Input placeholder='E.g.: São Paulo' />
                  </Form.Item>
                </Col>
                <Col lg={8} xs={24}>
                  <Form.Item
                    label={'Cidade'}
                    name={['location', 'city']}
                    rules={[
                      {
                        required: true,
                        message: 'O campo é obrigatório',
                      },
                      {
                        max: 255,
                        message: 'A cidade não pode ter mais de 255 caracteres',
                      },
                    ]}
                  >
                    <Input placeholder='E.g.: Guarulhos' />
                  </Form.Item>
                </Col>
                <Col lg={8} xs={24}>
                  <Form.Item
                    label={'Telefone'}
                    name={'phone'}
                    rules={[
                      {
                        required: true,
                        message: 'O campo é obrigatório',
                      },
                      {
                        max: 20,
                        message: 'O telefone não pode ter mais de 20 caracteres',
                      },
                    ]}
                  >
                    <MaskedInput mask={'(00) [0]0000-0000'} placeholder={'(11) 99999-9999'} />
                  </Form.Item>
                </Col>
                <Col lg={8} xs={24}>
                  <Form.Item
                    label={'CPF'}
                    name={'taxpayerId'}
                    rules={[
                      {
                        required: true,
                        message: 'O campo é obrigatório',
                      },
                      {
                        max: 14,
                        message: 'O CPF não pode ter mais de 14 caracteres',
                      },
                    ]}
                  >
                    <MaskedInput mask={'000.000.000-00'} placeholder={'111.222.3333-44'} />
                  </Form.Item>
                </Col>
                {isEditorRole && (
                  <>
                    <Col lg={8} xs={24}>
                      <Form.Item
                        label={'Preço por palavra'}
                        name={'pricePerWord'}
                        rules={[
                          {
                            required: true,
                            message: 'O campo é obrigatório',
                          },
                          {
                            type: 'number',
                            min: 0.01,
                            message: 'O valor mínimo é 1 centavo',
                          },
                        ]}
                      >
                        <CurrencyInput
                          onChange={(e, value) => {
                            form.setFieldsValue({
                              pricePerWord: value,
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                    {[1, 2, 3].map((_, index) => {
                      return (
                        <React.Fragment key={index}>
                          <Col lg={6} xs={18}>
                            <Form.Item
                              label={'Habilidade'}
                              name={['skills', index, 'name']}
                              rules={[
                                {
                                  required: true,
                                  message: 'O campo é obrigatório',
                                },
                                {
                                  max: 50,
                                  message: 'A habilidade não pode ter mais de 50 caracteres',
                                },
                              ]}
                            >
                              <Input placeholder='E.g.: JavaScript' />
                            </Form.Item>
                          </Col>
                          <Col lg={2} xs={6}>
                            <Form.Item
                              label={'%'}
                              name={['skills', index, 'percentage']}
                              rules={[
                                {
                                  required: true,
                                  message: '',
                                },
                                {
                                  async validator(field, value) {
                                    if (isNaN(Number(value))) throw new Error('Apenas números');

                                    if (Number(value) < 0) throw new Error('Min. 0');

                                    if (Number(value) > 100) throw new Error('Máx. 100');
                                  },
                                },
                              ]}
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                        </React.Fragment>
                      );
                    })}
                  </>
                )}
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane key={'bankAccount'} tab={'Dados bancários'} forceRender>
              <Row gutter={24}>
                <Col lg={8} xs={24}>
                  <Form.Item
                    label={'Instituição'}
                    name={['bankAccount', 'bankCode']}
                    rules={[
                      {
                        required: true,
                        message: 'O campo é obrigatório',
                      },
                      {
                        max: 3,
                        message: 'O código da instituição não pode ter mais de 3 caracteres',
                      },
                      {
                        min: 3,
                        message: 'O código da instituição não pode ter menos de 3 caracteres',
                      },
                    ]}
                  >
                    <Input placeholder='260' />
                  </Form.Item>
                </Col>
                <Col lg={8} xs={24}>
                  <Form.Item
                    label={'Agência'}
                    name={['bankAccount', 'agency']}
                    rules={[
                      {
                        required: true,
                        message: 'O campo é obrigatório',
                      },
                      {
                        max: 10,
                        message: 'O número da agência não pode ter mais de 10 caracteres',
                      },
                      {
                        min: 1,
                        message: 'O número da agência deve ter no mínimo 1 caracter',
                      },
                    ]}
                  >
                    <Input placeholder={'0001'} />
                  </Form.Item>
                </Col>
                <Col lg={8} xs={24}>
                  <Form.Item
                    label={'Conta (sem dígito)'}
                    name={['bankAccount', 'number']}
                    rules={[
                      {
                        required: true,
                        message: 'O campo é obrigatório',
                      },
                      {
                        max: 20,
                        message: 'O número da conta não pode ter mais de 20 caracteres',
                      },
                      {
                        min: 1,
                        message: 'O número da conta deve ter no mínimo 1 caracter',
                      },
                    ]}
                  >
                    <Input placeholder={'12345'} />
                  </Form.Item>
                </Col>
                <Col lg={8} xs={24}>
                  <Form.Item
                    label={'Dígito'}
                    name={['bankAccount', 'digit']}
                    rules={[
                      {
                        required: true,
                        message: 'O campo é obrigatório',
                      },
                      {
                        max: 1,
                        message: 'O dígito deve ter no máximo 1 caracter',
                      },
                      {
                        min: 1,
                        message: 'O dígito deve ter no mínimo 1 caracter',
                      },
                    ]}
                  >
                    <Input placeholder={'1'} />
                  </Form.Item>
                </Col>
                <Col lg={8} xs={24}>
                  <Form.Item
                    label={'Tipo de conta'}
                    name={['bankAccount', 'type']}
                    rules={[
                      {
                        required: true,
                        message: 'O campo é obrigatório',
                      },
                    ]}
                  >
                    <Select placeholder={'Selecione o tipo de conta'}>
                      <Select.Option value={'CHECKING'}>Conta corrente</Select.Option>
                      <Select.Option value={'SAVING'}>Conta poupança</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Tabs.TabPane>
          </Tabs>
        </Col>
        <Col lg={24} xs={24}>
          <Row justify={'end'}>
            <Button type={'primary'} htmlType={'submit'} loading={loading}>
              {props.user ? 'Atualizar usuário' : 'Cadastrar usuário'}
            </Button>
          </Row>
        </Col>
      </Row>
    </Form>
  );
}

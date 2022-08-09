import ResourceNotFoundError from 'tato_ap-sdk/dist/errors/ResourceNotFound.error';
import { useCallback, useState } from 'react';
import { Payment, Post } from 'tato_ap-sdk';
import PaymentService from 'tato_ap-sdk/dist/services/Payment.service';

export default function usePayment() {
  const [posts, setPosts] = useState<Post.WithEarnings[]>([]);
  const [payment, setPayment] = useState<Payment.Detailed>();
  const [paymentPreview, setPaymentPreview] = useState<Payment.Preview>();

  const [fetchingPosts, setFetchingPosts] = useState(false);
  const [fetchingPayment, setFetchingPayment] = useState(false);
  const [fetchingPaymentPreview, setFetchingPaymentPreview] = useState(false);
  const [schedulingPayment, setSchedulingPayment] = useState(false);
  const [approvingPayment, setApprovingPayment] = useState(false);

  const [notFound, setNotFound] = useState(false);

  const fetchPayment = useCallback(async (paymentId: number) => {
    try {
      setFetchingPayment(true);
      const payment = await PaymentService.getExistingPayment(paymentId);
      setPayment(payment);
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        setNotFound(true);
      } else {
        throw error;
      }
    } finally {
      setFetchingPayment(false);
    }
  }, []);

  const fetchPosts = useCallback(async (paymentId: number) => {
    try {
      setFetchingPosts(true);
      const posts = await PaymentService.getExistingPaymentPosts(paymentId);
      setPosts(posts);
    } finally {
      setFetchingPosts(false);
    }
  }, []);

  const fetchPaymentPreview = useCallback(async (paymentPreview: Payment.PreviewInput) => {
    try {
      setFetchingPaymentPreview(true);

      const preview = await PaymentService.getPaymentPreview(paymentPreview);
      setPaymentPreview(preview);
    } finally {
      setFetchingPaymentPreview(false);
    }
  }, []);

  const schedulePayment = useCallback(async (paymentInput: Payment.Input) => {
    try {
      setSchedulingPayment(true);
      await PaymentService.insertNewPayment(paymentInput);
    } finally {
      setSchedulingPayment(false);
    }
  }, []);

  const approvePayment = useCallback(async (paymentId: number) => {
    try {
      setApprovingPayment(true);
      await PaymentService.approvePayment(paymentId);
    } finally {
      setApprovingPayment(false);
    }
  }, []);

  const clearPaymentPreview = useCallback(() => {
    setPaymentPreview(undefined);
  }, []);

  return {
    posts,
    payment,
    paymentPreview,
    fetchingPosts,
    fetchingPayment,
    fetchingPaymentPreview,
    approvingPayment,
    schedulingPayment,
    notFound,
    fetchPosts,
    fetchPayment,
    fetchPaymentPreview,
    schedulePayment,
    clearPaymentPreview,
    approvePayment,
  };
}

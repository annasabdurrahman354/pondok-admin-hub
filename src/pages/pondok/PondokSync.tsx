
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/client';

// Form schemas
const pondokSchema = z.object({
  nama: z.string().min(2, { message: 'Nama pondok wajib diisi' }),
  telepon: z.string().min(2, { message: 'Nomor telepon wajib diisi' }),
  alamat: z.string().min(5, { message: 'Alamat wajib diisi' }),
  provinsi: z.string().min(1, { message: 'Provinsi wajib diisi' }),
  kota: z.string().min(1, { message: 'Kota wajib diisi' }),
  kecamatan: z.string().min(1, { message: 'Kecamatan wajib diisi' }),
  kelurahan: z.string().min(1, { message: 'Kelurahan wajib diisi' }),
  kode_pos: z.string().min(1, { message: 'Kode pos wajib diisi' }),
  daerah_sambung: z.string().min(1, { message: 'Daerah sambung wajib diisi' }),
});

const pengurusSchema = z.object({
  ketua: z.string().min(2, { message: 'Nama ketua wajib diisi' }),
  bendahara: z.string().min(2, { message: 'Nama bendahara wajib diisi' }),
  sekretaris: z.string().min(2, { message: 'Nama sekretaris wajib diisi' }),
  pinisepuh: z.string().min(2, { message: 'Nama pinisepuh wajib diisi' }),
});

type PondokFormValues = z.infer<typeof pondokSchema>;
type PengurusFormValues = z.infer<typeof pengurusSchema>;

const PondokSync = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<'pondok' | 'pengurus'>('pondok');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pondokForm = useForm<PondokFormValues>({
    resolver: zodResolver(pondokSchema),
    defaultValues: {
      nama: '',
      telepon: '',
      alamat: '',
      provinsi: '',
      kota: '',
      kecamatan: '',
      kelurahan: '',
      kode_pos: '',
      daerah_sambung: '',
    },
  });

  const pengurusForm = useForm<PengurusFormValues>({
    resolver: zodResolver(pengurusSchema),
    defaultValues: {
      ketua: '',
      bendahara: '',
      sekretaris: '',
      pinisepuh: '',
    },
  });

  const onPondokSubmit = (data: PondokFormValues) => {
    // Save pondok data temporarily
    localStorage.setItem('pondok_form_data', JSON.stringify(data));
    setStep('pengurus');
  };

  const onPengurusSubmit = async (data: PengurusFormValues) => {
    if (!user) {
      toast.error('User session not found');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Get previously saved pondok data
      const pondokData = JSON.parse(localStorage.getItem('pondok_form_data') || '{}');
      
      // Create new pondok in Supabase
      const { data: newPondok, error: pondokError } = await supabase
        .from('pondok')
        .insert({
          id: user.pondokId,
          nama: pondokData.nama,
          telepon: pondokData.telepon,
          alamat: pondokData.alamat,
          provinsi: pondokData.provinsi_id,
          kota: pondokData.kota_id,
          kecamatan: pondokData.kecamatan,
          kelurahan: pondokData.kelurahan,
          kode_pos: pondokData.kode_pos,
          daerah_sambung: pondokData.daerah_sambung,
          status_acc: false // Pending approval
        })
        .select()
        .single();
      
      if (pondokError) throw pondokError;
      
      // Insert pengurus data
      const pengurusToInsert = [
        { 
          pondok_id: user.pondokId, 
          nama: data.ketua, 
          jabatan: 'ketua' as const 
        },
        { 
          pondok_id: user.pondokId, 
          nama: data.bendahara, 
          jabatan: 'bendahara' as const 
        },
        { 
          pondok_id: user.pondokId, 
          nama: data.sekretaris, 
          jabatan: 'sekretaris' as const 
        },
        { 
          pondok_id: user.pondokId, 
          nama: data.pinisepuh, 
          jabatan: 'pinisepuh' as const 
        }
      ];
      
      const { error: pengurusError } = await supabase
        .from('pengurus_pondok')
        .insert(pengurusToInsert);
      
      if (pengurusError) throw pengurusError;
      
      // Clean up the temporary form data
      localStorage.removeItem('pondok_form_data');
      
      toast.success('Data pondok telah disimpan dan menunggu persetujuan');
      navigate('/pondok/dashboard');
    } catch (error: any) {
      console.error('Error submitting pondok data:', error);
      toast.error(error.message || 'Gagal menyimpan data pondok');
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    if (step === 'pengurus') {
      setStep('pondok');
    } else {
      navigate('/login');
    }
  };

  const pondokFormCard = (
    <motion.div
      key="pondok-form"
      initial={{ opacity: 0, x: step === 'pondok' ? 100 : -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full glass-morphism">
        <CardHeader>
          <CardTitle>Data Pondok</CardTitle>
          <CardDescription>
            Lengkapi informasi pondok Anda untuk proses sinkronisasi
          </CardDescription>
        </CardHeader>
        <Form {...pondokForm}>
          <form onSubmit={pondokForm.handleSubmit(onPondokSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={pondokForm.control}
                name="nama"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Pondok</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama Pondok" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={pondokForm.control}
                  name="telepon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telepon</FormLabel>
                      <FormControl>
                        <Input placeholder="Nomor Telepon" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={pondokForm.control}
                  name="kode_pos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kode Pos</FormLabel>
                      <FormControl>
                        <Input placeholder="Kode Pos" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={pondokForm.control}
                name="alamat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="Alamat Lengkap" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={pondokForm.control}
                  name="provinsi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provinsi</FormLabel>
                      <FormControl>
                        <Input placeholder="Provinsi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={pondokForm.control}
                  name="kota"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kota</FormLabel>
                      <FormControl>
                        <Input placeholder="Kota" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={pondokForm.control}
                  name="kecamatan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kecamatan</FormLabel>
                      <FormControl>
                        <Input placeholder="Kecamatan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={pondokForm.control}
                  name="kelurahan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kelurahan</FormLabel>
                      <FormControl>
                        <Input placeholder="Kelurahan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={pondokForm.control}
                name="daerah_sambung"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daerah Sambung</FormLabel>
                    <FormControl>
                      <Input placeholder="Daerah Sambung" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Button>
              <Button type="submit">
                Lanjut
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </motion.div>
  );

  const pengurusFormCard = (
    <motion.div
      key="pengurus-form"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full glass-morphism">
        <CardHeader>
          <CardTitle>Data Pengurus</CardTitle>
          <CardDescription>
            Lengkapi informasi pengurus pondok Anda
          </CardDescription>
        </CardHeader>
        <Form {...pengurusForm}>
          <form onSubmit={pengurusForm.handleSubmit(onPengurusSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={pengurusForm.control}
                name="ketua"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Ketua</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama Ketua Pondok" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={pengurusForm.control}
                name="bendahara"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Bendahara</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama Bendahara Pondok" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={pengurusForm.control}
                name="sekretaris"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Sekretaris</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama Sekretaris Pondok" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={pengurusForm.control}
                name="pinisepuh"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Pinisepuh</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama Pinisepuh Pondok" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
                <Save className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/50 px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Sinkronisasi Data Pondok</h1>
          <p className="text-muted-foreground">
            Selamat datang! Lengkapi informasi pondok untuk memulai
          </p>
        </div>
        
        <div className="flex justify-center mb-8">
          <div className="flex items-center w-full max-w-md">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'pondok' ? 'bg-primary text-white' : 'bg-primary text-white'
              }`}>
                1
              </div>
              <span className="text-xs mt-1">Data Pondok</span>
            </div>
            <div className={`h-1 flex-1 mx-2 ${
              step === 'pengurus' ? 'bg-primary' : 'bg-muted'
            }`} />
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'pengurus' ? 'bg-primary text-white' : 'bg-muted'
              }`}>
                2
              </div>
              <span className="text-xs mt-1">Data Pengurus</span>
            </div>
          </div>
        </div>
        
        {step === 'pondok' ? pondokFormCard : pengurusFormCard}
      </div>
    </div>
  );
};

export default PondokSync;

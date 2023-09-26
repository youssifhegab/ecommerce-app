'use client';

import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/UIComponents/Select';

import InputComponent from '@/components/FormElements/InputComponent';
import ComponentLevelLoader from '@/components/Loader';
import Notification from '@/components/Notification';
import { GlobalContext } from '@/context/GlobalState';
import { addNewProduct, updateAProduct } from '@/services/product';
import { firebaseConfig, firebaseStorageURL } from '@/utils';
import { Button } from '@/components/UIComponents/Button';
import { getSizeName } from '@/lib/utils';

const app = initializeApp(firebaseConfig);
const storage = getStorage(app, firebaseStorageURL);

const createUniqueFileName = getFile => {
  const timeStamp = Date.now();
  const randomStringValue = Math.random().toString(36).substring(2, 12);

  return `${getFile.name}-${timeStamp}-${randomStringValue}`;
};

async function helperForUPloadingImageToFirebase(file) {
  const getFileName = createUniqueFileName(file);
  const storageReference = ref(storage, `ecommerce/${getFileName}`);
  const uploadImage = uploadBytesResumable(storageReference, file);

  return new Promise((resolve, reject) => {
    uploadImage.on(
      'state_changed',
      () => {},
      error => {
        console.log(error);
        reject(error);
      },
      () => {
        getDownloadURL(uploadImage.snapshot.ref)
          .then(downloadUrl => resolve(downloadUrl))
          .catch(error => reject(error));
      },
    );
  });
}
const sizesList = [{ id: 's' }, { id: 'm' }, { id: 'l' }];

export default function AdminAddNewProduct() {
  const params = useSearchParams();
  const router = useRouter();
  const { componentLevelLoader, setComponentLevelLoader } = useContext(GlobalContext);
  const [sizes, setSizes] = useState([]);

  const productUpdateDetails = JSON.parse(decodeURIComponent(params.get('item')));
  const { register, handleSubmit, setValue, getValues } = useForm({
    defaultValues: productUpdateDetails || {
      name: '',
      price: 0,
      description: '',
      category: 'men',
      sizes: [],
      deliveryInfo: '',
      onSale: 'no',
      priceDrop: 0,
      image: '',
    },
  });

  const handleAddProduct = async data => {
    const { image, ...restData } = data;
    const extractImageUrl = await helperForUPloadingImageToFirebase(image[0]);
    setComponentLevelLoader({ loading: true, id: '' });
    const res =
      productUpdateDetails !== null
        ? await updateAProduct({ ...restData, imageUrl: extractImageUrl || '', sizes })
        : await addNewProduct({ ...restData, imageUrl: extractImageUrl || '', sizes });

    if (res.success) {
      setComponentLevelLoader({ loading: false, id: '' });
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });

      router.push('/admin-view/all-products');
    } else {
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setComponentLevelLoader({ loading: false, id: '' });
    }
  };

  return (
    <div className="w-full mr-0 mb-0 ml-0 relative">
      <div className="flex flex-col items-start justify-start p-10 bg-background shadow-2xl rounded-xl relative">
        <form onSubmit={handleSubmit(handleAddProduct)} className="w-full mt-6 mr-0 mb-0 ml-0 space-y-8">
          <input accept="image/*" max="1000000" type="file" {...register('image')} />

          <div className="flex gap-2 flex-col">
            <label>Available sizes</label>
            <div className="flex gap-2">
              {sizesList.map(size => (
                <Button
                  type="button"
                  key={size.id}
                  variant={sizes.includes(size.id) ? 'default' : 'outline'}
                  onClick={() => {
                    setSizes(prevSizes =>
                      sizes.includes(size.id) ? prevSizes.filter(size => size !== size.id) : [...prevSizes, size.id],
                    );
                  }}
                >
                  {getSizeName(size.id)}
                </Button>
              ))}
            </div>
          </div>
          <InputComponent placeholder="Enter Product name" label="Name" register={{ ...register('name') }} />
          <InputComponent placeholder="Enter price" label="Price" type="number" register={{ ...register('price') }} />
          <InputComponent placeholder="Enter description" label="Description" register={{ ...register('description') }} />
          <Select value={getValues().category} onValueChange={e => setValue('category', e)}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="men">Men</SelectItem>
              <SelectItem value="women">Women</SelectItem>
              <SelectItem value="kids">Kids</SelectItem>
            </SelectContent>
          </Select>
          <InputComponent placeholder="Enter delivery info" label="Delivery Info" register={{ ...register('deliveryInfo') }} />
          <Select value={getValues().onSale} onValueChange={e => setValue('onSale', e)}>
            <SelectTrigger>
              <SelectValue placeholder="On Sale" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
          <InputComponent
            placeholder="Enter Price Drop"
            label="Price Drop"
            type="number"
            register={{ ...register('priceDrop') }}
          />
          <Button type="submit">
            {componentLevelLoader && componentLevelLoader.loading ? (
              <ComponentLevelLoader
                text={productUpdateDetails !== null ? 'Updating Product' : 'Adding Product'}
                loading={componentLevelLoader && componentLevelLoader.loading}
              />
            ) : productUpdateDetails !== null ? (
              'Update Product'
            ) : (
              'Add Product'
            )}
          </Button>
        </form>
      </div>
      <Notification />
    </div>
  );
}

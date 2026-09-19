import React, { useMemo, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  Badge,
} from 'reactstrap';
import { Link } from 'react-router-dom';

import { TableContainer } from '../../../common/AnalyticsTable/TableContainerReactTable';
import {
  SortTanstackInterface,
  SortInterface,
} from '../../../Typecomponents/ComponentsType';

import RSelect from '../../../Components/Common/RSelect/RSelect';
import { toast } from 'react-toastify';

interface SelectOption {
  value: string | number;
  label: string;
}

interface MarketplaceRow {
  category_id: number;
  category_name: string;
  product_name: string;
  product_desc: string;
  images: string[];
  price: number;
  location: string;
  type: string;
  registered_userid: string;
}

const MarketPlace = () => {
  const [data, setData] = useState<MarketplaceRow[]>([
    {
      category_id: 1,
      category_name: 'Electronics',
      product_name: 'Samsung Mobile',
      product_desc: 'Good condition Samsung mobile phone',
      images: [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500',
      ],
      price: 15000,
      location: 'Thiruvananthapuram',
      type: 'Sell',
      registered_userid: 'USER001',
    },
    {
      category_id: 2,
      category_name: 'Furniture',
      product_name: 'Wooden Table',
      product_desc: 'Strong wooden dining table',
      images: [
        'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=500',
      ],
      price: 8500,
      location: 'Kollam',
      type: 'Sell',
      registered_userid: 'USER002',
    },
    {
      category_id: 3,
      category_name: 'Vehicles',
      product_name: 'Honda Activa',
      product_desc: 'Well maintained scooter',
      images: [
        'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500',
        'https://images.unsplash.com/photo-1558980664-10ea7b4f1c6c?w=500',
      ],
      price: 65000,
      location: 'Kochi',
      type: 'Sell',
      registered_userid: 'USER003',
    },
    {
      category_id: 4,
      category_name: 'Books',
      product_name: 'Engineering Books',
      product_desc: 'Engineering reference books',
      images: [
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500',
      ],
      price: 1200,
      location: 'Kottayam',
      type: 'Exchange',
      registered_userid: 'USER004',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);

  const [sorting, setSorting] = useState<SortTanstackInterface[]>([]);

  const [loading, setLoading] = useState(false);

  const [filterOpen, setFilterOpen] = useState(false);

  const [filterProductName, setFilterProductName] = useState('');
  const [filterCategory, setFilterCategory] =
    useState<SelectOption | null>(null);
  const [filterType, setFilterType] =
    useState<SelectOption | null>(null);



  const categoryData: SelectOption[] = [
    {
      value: 1,
      label: 'Electronics',
    },
    {
      value: 2,
      label: 'Furniture',
    },
    {
      value: 3,
      label: 'Vehicles',
    },
    {
      value: 4,
      label: 'Books',
    },
    {
      value: 5,
      label: 'Clothing',
    },
    {
      value: 6,
      label: 'Home Appliances',
    },
  ];

 
  const typeOptions: SelectOption[] = [
    {
      value: 'Sell',
      label: 'Sell',
    },
    {
      value: 'Exchange',
      label: 'Exchange',
    },
    {
      value: 'Free',
      label: 'Free',
    },
  ];


  const fetchData = async (requestdata?: any) => {
    setLoading(true);

    console.log('FAKE GET MARKETPLACE API:', requestdata);

    await new Promise((resolve) => setTimeout(resolve, 500));

    setLoading(false);
  };

 
  const initialRequest = {
    start: 0,
    sort: [],
    numberOfRows: 10,
    filters: [],
  };

  

  const validationSchema = Yup.object({
    category_id: Yup.number()
      .required('Category is required')
      .typeError('Category is required'),

    product_name: Yup.string()
      .min(3, 'Minimum 3 characters')
      .required('Product name is required'),

    product_desc: Yup.string()
      .min(10, 'Minimum 10 characters')
      .required('Product description is required'),

    images: Yup.array()
      .min(1, 'At least one image is required')
      .required('Image is required'),

    price: Yup.number()
      .typeError('Price must be a number')
      .required('Price is required'),

    location: Yup.string().required('Location is required'),

    type: Yup.string().required('Type is required'),

    registered_userid: Yup.string().required(
      'Registered User ID is required'
    ),
  });

  

  const formik = useFormik<MarketplaceRow>({
    initialValues: {
      category_id: 0,
      category_name: '',
      product_name: '',
      product_desc: '',
      images: [],
      price: 0,
      location: '',
      type: '',
      registered_userid: '',
    },

    validationSchema,

    onSubmit: async (values, { resetForm }) => {
      setLoading(true);

      
      const selectedCategory = categoryData.find(
        (item) => Number(item.value) === Number(values.category_id)
      );

      const marketplaceData: MarketplaceRow = {
        ...values,
        category_name: selectedCategory?.label || '',
      };

      console.log('FAKE API REQUEST:', marketplaceData);

      await new Promise((resolve) => setTimeout(resolve, 500));

      
      if (editId !== null) {
        setData((prevData) =>
          prevData.map((item, index) =>
            index === editId
              ? marketplaceData
              : item
          )
        );

        toast('Marketplace item updated successfully', {
          position: 'top-right',
          type: 'success',
        });
      }

     
      else {
        setData((prevData) => [
          ...prevData,
          marketplaceData,
        ]);

        toast('Marketplace item added successfully', {
          position: 'top-right',
          type: 'success',
        });
      }

      setLoading(false);

      resetForm();

      setEditId(null);

      setShowForm(false);
    },
  });

 

  const handleImageChange = (event: any) => {
    const files = Array.from(event.target.files || []) as File[];

    if (!files.length) {
      return;
    }

    const imageUrls = files.map((file) =>
      URL.createObjectURL(file)
    );

    formik.setFieldValue('images', [
      ...formik.values.images,
      ...imageUrls,
    ]);
  };

 

  const removeImage = (index: number) => {
    const updatedImages = formik.values.images.filter(
      (_, imageIndex) => imageIndex !== index
    );

    formik.setFieldValue('images', updatedImages);
  };

  

  const handleEdit = (row: MarketplaceRow) => {
    const rowIndex = data.findIndex(
      (item) =>
        item.product_name === row.product_name &&
        item.registered_userid === row.registered_userid
    );

    setEditId(rowIndex);

    formik.setValues({
      category_id: row.category_id,
      category_name: row.category_name,
      product_name: row.product_name,
      product_desc: row.product_desc,
      images: row.images || [],
      price: row.price,
      location: row.location,
      type: row.type,
      registered_userid: row.registered_userid,
    });

    setShowForm(true);
  };

  

  const deleteMarketplace = async (row: MarketplaceRow) => {
    setLoading(true);

    console.log('FAKE DELETE API:', row);

    await new Promise((resolve) => setTimeout(resolve, 500));

    setData((prevData) =>
      prevData.filter(
        (item) =>
          !(
            item.product_name === row.product_name &&
            item.registered_userid === row.registered_userid
          )
      )
    );

    toast('Marketplace item deleted successfully', {
      position: 'top-right',
      type: 'success',
    });

    setLoading(false);
  };

  

  const handleDelete = (row: MarketplaceRow) => {
    deleteMarketplace(row);
  };



  
const columns = useMemo(
  () => [
    {
      header: 'Sl No',
      accessorKey: 'slno',
      enableColumnFilter: false,
      size: 60,
      minSize: 60,
      maxSize: 60,
      cell: (cell: any) => (
        <div
          style={{
            width: '60px',
            textAlign: 'center',
          }}
        >
          {cell.row.index + 1}
        </div>
      ),
    },

    {
      header: 'Category',
      accessorKey: 'category_name',
      enableColumnFilter: false,
      size: 120,
      minSize: 120,
      maxSize: 120,
      cell: (cell: any) => (
        <div
          style={{
            width: '120px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={cell.row.original.category_name}
        >
          {cell.row.original.category_name}
        </div>
      ),
    },

    {
      header: 'Product Name',
      accessorKey: 'product_name',
      enableColumnFilter: false,
      size: 150,
      minSize: 150,
      maxSize: 150,
      cell: (cell: any) => (
        <div
          style={{
            width: '150px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={cell.row.original.product_name}
        >
          {cell.row.original.product_name}
        </div>
      ),
    },

    {
      header: 'Description',
      accessorKey: 'product_desc',
      enableColumnFilter: false,
      size: 200,
      minSize: 200,
      maxSize: 200,
      cell: (cell: any) => {
        const description =
          cell.row.original.product_desc || '';

        return (
          <div
            style={{
              width: '200px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={description}
          >
            {description}
          </div>
        );
      },
    },

    {
      header: 'Images',
      accessorKey: 'images',
      enableColumnFilter: false,
      size: 150,
      minSize: 150,
      maxSize: 150,

      cell: (cell: any) => {
        const images =
          cell.row.original.images || [];

        if (!images.length) {
          return (
            <span className="text-muted">
              No Images
            </span>
          );
        }

        return (
          <div
            className="d-flex align-items-center"
            style={{
              width: '150px',
              gap: '4px',
              overflow: 'hidden',
            }}
          >
            {images
              .slice(0, 3)
              .map(
                (
                  image: string,
                  index: number
                ) => (
                  <img
                    key={index}
                    src={image}
                    alt={`product-${index}`}
                    width="42"
                    height="42"
                    style={{
                      width: '42px',
                      height: '42px',
                      objectFit: 'cover',
                      borderRadius: '6px',
                      border:
                        '1px solid #ddd',
                      flexShrink: 0,
                    }}
                  />
                )
              )}

            {images.length > 3 && (
              <Badge
                color="secondary"
                pill
              >
                +{images.length - 3}
              </Badge>
            )}
          </div>
        );
      },
    },

    {
      header: 'Price',
      accessorKey: 'price',
      enableColumnFilter: false,
      size: 100,
      minSize: 100,
      maxSize: 100,

      cell: (cell: any) => (
        <div
          style={{
            width: '100px',
            whiteSpace: 'nowrap',
          }}
        >
          <strong>
            ₹
            {Number(
              cell.row.original.price || 0
            ).toLocaleString('en-IN')}
          </strong>
        </div>
      ),
    },

    {
      header: 'Location',
      accessorKey: 'location',
      enableColumnFilter: false,
      size: 130,
      minSize: 130,
      maxSize: 130,

      cell: (cell: any) => (
        <div
          style={{
            width: '130px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={cell.row.original.location}
        >
          {cell.row.original.location}
        </div>
      ),
    },

    {
      header: 'Type',
      accessorKey: 'type',
      enableColumnFilter: false,
      size: 100,
      minSize: 100,
      maxSize: 100,

      cell: (cell: any) => {
        const type =
          cell.row.original.type;

        let color = 'primary';

        if (type === 'Sell') {
          color = 'success';
        }

        if (type === 'Exchange') {
          color = 'warning';
        }

        if (type === 'Free') {
          color = 'info';
        }

        return (
          <div
            style={{
              width: '100px',
            }}
          >
            <Badge
              color={color}
              pill
            >
              {type}
            </Badge>
          </div>
        );
      },
    },

    {
      header: 'Registered User',
      accessorKey: 'registered_userid',
      enableColumnFilter: false,
      size: 130,
      minSize: 130,
      maxSize: 130,

      cell: (cell: any) => (
        <div
          style={{
            width: '130px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={
            cell.row.original
              .registered_userid
          }
        >
          {
            cell.row.original
              .registered_userid
          }
        </div>
      ),
    },

    {
      header: 'Actions',
      enableColumnFilter: false,
      size: 150,
      minSize: 150,
      maxSize: 150,

      cell: (cell: any) => {
        const row =
          cell.row.original;

        return (
          <div
            className="d-flex gap-2"
            style={{
              width: '150px',
              whiteSpace: 'nowrap',
            }}
          >
            <Button
              size="sm"
              color="soft-warning"
              onClick={() =>
                handleEdit(row)
              }
            >
              Edit
            </Button>

            <Button
              size="sm"
              color="soft-danger"
              onClick={() =>
                handleDelete(row)
              }
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ],
  [data]
);



  

  const getFilteredData = () => {
    let filteredData = [...data];

   

    if (filterProductName.trim()) {
      filteredData = filteredData.filter((item) =>
        item.product_name
          .toLowerCase()
          .includes(
            filterProductName.trim().toLowerCase()
          )
      );
    }

   
    if (filterCategory) {
      filteredData = filteredData.filter(
        (item) =>
          Number(item.category_id) ===
          Number(filterCategory.value)
      );
    }

   

    if (filterType) {
      filteredData = filteredData.filter(
        (item) =>
          item.type === filterType.value
      );
    }

    return filteredData;
  };



  const handleApplyFilter = () => {
    const filteredData = getFilteredData();

    setData(filteredData);

    setPage(1);

    toast(
      `${filteredData.length} marketplace item(s) found`,
      {
        position: 'top-right',
        type: 'success',
      }
    );
  };

 

  const handleClearFilter = () => {
    setFilterProductName('');

    setFilterCategory(null);

    setFilterType(null);

    

    setData([
      {
        category_id: 1,
        category_name: 'Electronics',
        product_name: 'Samsung Mobile',
        product_desc:
          'Good condition Samsung mobile phone',
        images: [
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
          'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500',
        ],
        price: 15000,
        location: 'Thiruvananthapuram',
        type: 'Sell',
        registered_userid: 'USER001',
      },

      {
        category_id: 2,
        category_name: 'Furniture',
        product_name: 'Wooden Table',
        product_desc:
          'Strong wooden dining table',
        images: [
          'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=500',
        ],
        price: 8500,
        location: 'Kollam',
        type: 'Sell',
        registered_userid: 'USER002',
      },

      {
        category_id: 3,
        category_name: 'Vehicles',
        product_name: 'Honda Activa',
        product_desc:
          'Well maintained scooter',
        images: [
          'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500',
          'https://images.unsplash.com/photo-1558980664-10ea7b4f1c6c?w=500',
        ],
        price: 65000,
        location: 'Kochi',
        type: 'Sell',
        registered_userid: 'USER003',
      },

      {
        category_id: 4,
        category_name: 'Books',
        product_name: 'Engineering Books',
        product_desc:
          'Engineering reference books',
        images: [
          'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500',
        ],
        price: 1200,
        location: 'Kottayam',
        type: 'Exchange',
        registered_userid: 'USER004',
      },
    ]);

    setPage(1);
  };

  

  const handleTableChange = ({
    page,
    sizePerPage,
    sortField,
    sortOrder,
  }: any) => {
    setPage(page);

    setSizePerPage(sizePerPage);

    let sort: SortInterface[] = [];

    if (sortField && sortOrder) {
      sort = [
        {
          columnName: sortField,
          sortOrder: sortOrder,
        },
      ];
    }

    console.log('FAKE TABLE REQUEST:', {
      start: (page - 1) * sizePerPage,
      sort,
      numberOfRows: sizePerPage,
    });
  };

  

  return (
    <div className="page-content">
      <div className="container-fluid">

        {/* Breadcrumb */}

        <Row>
          <Col xs="12">

            <div className="page-title-box d-flex align-items-center justify-content-between">

              <h4 className="mb-0">
                Marketplace
              </h4>

              <Breadcrumb listClassName="m-0">

                <BreadcrumbItem>
                  <Link to="/villageapp">
                    VillageApp
                  </Link>
                </BreadcrumbItem>

                <BreadcrumbItem active>
                  Marketplace
                </BreadcrumbItem>

              </Breadcrumb>

            </div>

          </Col>
        </Row>

       

        {showForm && (
          <Row>

            <Col md="12">

              <Card>

                <CardHeader>
                  <h4>
                    {editId !== null
                      ? 'Edit Marketplace Item'
                      : 'Marketplace Form'}
                  </h4>
                </CardHeader>

                <CardBody>

                  <Form
                    onSubmit={formik.handleSubmit}
                  >

                    {/* Category + Product Name */}

                    <Row>

                      <Col md={6}>

                        <FormGroup>

                          <Label>
                            Category
                          </Label>

                          <RSelect
                            name="category_id"
                            id="category_id"
                            value={
                              categoryData.find(
                                (item) =>
                                  Number(item.value) ===
                                  Number(
                                    formik.values.category_id
                                  )
                              ) || null
                            }
                            onChange={(selected: any) => {

                              formik.setFieldValue(
                                'category_id',
                                selected?.value || 0
                              );

                              formik.setFieldValue(
                                'category_name',
                                selected?.label || ''
                              );
                            }}
                            options={categoryData}
                            placeholder="-- Select Category --"
                            isClearable
                          />

                          {formik.touched.category_id &&
                            formik.errors.category_id && (
                              <div className="text-danger mt-1">
                                {formik.errors.category_id as string}
                              </div>
                            )}

                        </FormGroup>

                      </Col>

                      <Col md={6}>

                        <FormGroup>

                          <Label>
                            Product Name
                          </Label>

                          <Input
                            name="product_name"
                            value={
                              formik.values.product_name
                            }
                            onChange={
                              formik.handleChange
                            }
                            onBlur={
                              formik.handleBlur
                            }
                            invalid={
                              !!formik.errors.product_name &&
                              !!formik.touched.product_name
                            }
                            placeholder="Enter Product Name"
                          />

                          <FormFeedback>
                            {formik.errors.product_name}
                          </FormFeedback>

                        </FormGroup>

                      </Col>

                    </Row>

                    {/* Description */}

                    <FormGroup>

                      <Label>
                        Product Description
                      </Label>

                      <Input
                        type="textarea"
                        rows={4}
                        name="product_desc"
                        value={
                          formik.values.product_desc
                        }
                        onChange={
                          formik.handleChange
                        }
                        onBlur={
                          formik.handleBlur
                        }
                        invalid={
                          !!formik.errors.product_desc &&
                          !!formik.touched.product_desc
                        }
                        placeholder="Enter Product Description"
                      />

                      <FormFeedback>
                        {formik.errors.product_desc}
                      </FormFeedback>

                    </FormGroup>

                    {/* Images */}

                    <FormGroup>

                      <Label>
                        Product Images
                      </Label>

                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                      />

                      <small className="text-muted">
                        You can select multiple images.
                      </small>

                      {formik.errors.images &&
                        formik.touched.images && (
                          <div className="text-danger mt-1">
                            {formik.errors.images as string}
                          </div>
                        )}

                      {/* Image Preview */}

                      {formik.values.images.length > 0 && (

                        <div className="d-flex flex-wrap gap-3 mt-3">

                          {formik.values.images.map(
                            (image, index) => (

                              <div
                                key={index}
                                style={{
                                  position:
                                    'relative',
                                  width: 120,
                                  height: 120,
                                }}
                              >

                                <img
                                  src={image}
                                  alt={`preview-${index}`}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit:
                                      'cover',
                                    borderRadius:
                                      '8px',
                                    border:
                                      '1px solid #ddd',
                                  }}
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeImage(index)
                                  }
                                  style={{
                                    position:
                                      'absolute',
                                    top: 5,
                                    right: 5,
                                    background:
                                      'red',
                                    color:
                                      '#fff',
                                    border:
                                      'none',
                                    borderRadius:
                                      '50%',
                                    width: 25,
                                    height: 25,
                                    cursor:
                                      'pointer',
                                  }}
                                >
                                  ✕
                                </button>

                              </div>

                            )
                          )}

                        </div>

                      )}

                    </FormGroup>

                    {/* Price + Type */}

                    <Row>

                      <Col md={6}>

                        <FormGroup>

                          <Label>
                            Price
                          </Label>

                          <Input
                            type="number"
                            name="price"
                            value={
                              formik.values.price
                            }
                            onChange={
                              formik.handleChange
                            }
                            onBlur={
                              formik.handleBlur
                            }
                            invalid={
                              !!formik.errors.price &&
                              !!formik.touched.price
                            }
                            placeholder="Enter Price"
                          />

                          <FormFeedback>
                            {formik.errors.price}
                          </FormFeedback>

                        </FormGroup>

                      </Col>

                      <Col md={6}>

                        <FormGroup>

                          <Label>
                            Type
                          </Label>

                          <RSelect
                            name="type"
                            value={
                              typeOptions.find(
                                (item) =>
                                  item.value ===
                                  formik.values.type
                              ) || null
                            }
                            onChange={(selected: any) =>
                              formik.setFieldValue(
                                'type',
                                selected?.value || ''
                              )
                            }
                            options={typeOptions}
                            placeholder="-- Select Type --"
                            isClearable
                          />

                          {formik.touched.type &&
                            formik.errors.type && (
                              <div className="text-danger mt-1">
                                {formik.errors.type as string}
                              </div>
                            )}

                        </FormGroup>

                      </Col>

                    </Row>

                    {/* Location + User ID */}

                    <Row>

                      <Col md={6}>

                        <FormGroup>

                          <Label>
                            Location
                          </Label>

                          <Input
                            name="location"
                            value={
                              formik.values.location
                            }
                            onChange={
                              formik.handleChange
                            }
                            onBlur={
                              formik.handleBlur
                            }
                            invalid={
                              !!formik.errors.location &&
                              !!formik.touched.location
                            }
                            placeholder="Enter Location"
                          />

                          <FormFeedback>
                            {formik.errors.location}
                          </FormFeedback>

                        </FormGroup>

                      </Col>

                      <Col md={6}>

                        <FormGroup>

                          <Label>
                            Registered User ID
                          </Label>

                          <Input
                            name="registered_userid"
                            value={
                              formik.values
                                .registered_userid
                            }
                            onChange={
                              formik.handleChange
                            }
                            onBlur={
                              formik.handleBlur
                            }
                            invalid={
                              !!formik.errors
                                .registered_userid &&
                              !!formik.touched
                                .registered_userid
                            }
                            placeholder="Enter Registered User ID"
                          />

                          <FormFeedback>
                            {
                              formik.errors
                                .registered_userid
                            }
                          </FormFeedback>

                        </FormGroup>

                      </Col>

                    </Row>

                    {/* Buttons */}

                    <div className="d-flex gap-2 mt-3">

                      <Button
                        type="button"
                        color="soft-secondary"
                        onClick={() => {
                          setShowForm(false);
                          setEditId(null);
                          formik.resetForm();
                        }}
                      >
                        Cancel
                      </Button>

                      <Button
                        color="primary"
                        type="submit"
                        disabled={loading}
                      >
                        {loading
                          ? 'Saving...'
                          : editId !== null
                          ? 'Update'
                          : 'Submit'}
                      </Button>

                    </div>

                  </Form>

                </CardBody>

              </Card>

            </Col>

          </Row>
        )}

        {/* =================================================
            TABLE
        ================================================= */}

        {!showForm && (

          <Card>

            <CardHeader className="d-flex justify-content-between align-items-center">

              <h4 className="card-title mb-0">
                Marketplace List
              </h4>

              <div className="d-flex gap-2">

                <Button
                  color={
                    filterOpen
                      ? 'secondary'
                      : 'soft-primary'
                  }
                  size="sm"
                  onClick={() =>
                    setFilterOpen(!filterOpen)
                  }
                >
                  <i className="mdi mdi-filter-outline me-1"></i>

                  {filterOpen
                    ? 'Hide Filters'
                    : 'Filter'}
                </Button>

                <Button
                  color="soft-success"
                  size="sm"
                  onClick={() => {

                    formik.resetForm();

                    setEditId(null);

                    setShowForm(true);

                  }}
                >
                  + Add New
                </Button>

              </div>

            </CardHeader>

            {/* =================================================
                FILTER PANEL
            ================================================= */}

            {filterOpen && (

              <CardBody className="border-bottom bg-light">

                <Row className="g-3">

                  {/* Product */}

                  <Col md={4}>

                    <FormGroup className="mb-0">

                      <Label className="form-label font-size-13 text-muted">
                        Product Name
                      </Label>

                      <Input
                        type="text"
                        placeholder="Search Product Name"
                        value={
                          filterProductName
                        }
                        onChange={(e) =>
                          setFilterProductName(
                            e.target.value
                          )
                        }
                      />

                    </FormGroup>

                  </Col>

                  {/* Category */}

                  <Col md={4}>

                    <FormGroup className="mb-0">

                      <Label className="form-label font-size-13 text-muted">
                        Category
                      </Label>

                      <RSelect
                        value={filterCategory}
                        onChange={(selected: any) =>
                          setFilterCategory(
                            selected
                          )
                        }
                        options={categoryData}
                        placeholder="Select Category"
                        isClearable
                      />

                    </FormGroup>

                  </Col>

                  {/* Type */}

                  <Col md={4}>

                    <FormGroup className="mb-0">

                      <Label className="form-label font-size-13 text-muted">
                        Type
                      </Label>

                      <RSelect
                        value={filterType}
                        onChange={(selected: any) =>
                          setFilterType(
                            selected
                          )
                        }
                        options={typeOptions}
                        placeholder="Select Type"
                        isClearable
                      />

                    </FormGroup>

                  </Col>

                </Row>

                <div className="d-flex justify-content-end gap-2 mt-3">

                  <Button
                    color="soft-secondary"
                    size="sm"
                    onClick={handleClearFilter}
                  >
                    Clear
                  </Button>

                  <Button
                    color="primary"
                    size="sm"
                    onClick={handleApplyFilter}
                  >
                    Apply Filter
                  </Button>

                </div>

              </CardBody>

            )}

            {/* TABLE */}

            <CardBody
  style={{
    overflowX: 'auto',
    width: '100%',
  }}
>
  <div
    style={{
      width: '100%',
      overflowX: 'auto',
    }}
  >
    <TableContainer
      columns={columns}
      data={data}
      page={page}
      sizePerPage={sizePerPage}
      totalCount={data.length}
      handleTableChange={handleTableChange}
      sorting={sorting}
      setSorting={setSorting}
    />
  </div>
</CardBody>

          </Card>

        )}

      </div>
    </div>
  );
};

export default MarketPlace;


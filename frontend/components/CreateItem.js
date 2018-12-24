import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import gql from 'graphql-tag';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';

export const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

class CreateItem extends Component {
  state = {
    title: 'Cool Shoes',
    description: 'I love these new shoes',
    image: '',
    largeImage: '',
    price: 80
  };

  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  uploadFile = async e => {
    console.log('uploading file!');
    const { files } = e.target;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'sickfits');

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/graysmith00/image/upload',
      {
        method: 'POST',
        body: data
      }
    );

    const file = await res.json();

    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url
    });
  };

  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error }) => (
          <Form
            onSubmit={async e => {
              e.preventDefault();
              // call mutation
              const res = await createItem();
              // redirect
              Router.push({
                pathname: '/item',
                query: { id: res.data.createItem.id }
              });
            }}
          >
            <Error error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="title">
                Title
                <input
                  onChange={this.uploadFile}
                  type="file"
                  id="file"
                  name="file"
                  placeholder="Upload an image"
                  required
                />
                {this.state.image && (
                  <img
                    src={this.state.image}
                    alt="upload preview"
                    width="200"
                  />
                )}
              </label>

              <label htmlFor="title">
                Title
                <input
                  onChange={this.handleChange}
                  type="text"
                  id="title"
                  name="title"
                  value={this.state.title}
                  placeholder="Title"
                  required
                />
              </label>

              <label htmlFor="price">
                Price
                <input
                  onChange={this.handleChange}
                  type="number"
                  id="price"
                  name="price"
                  value={this.state.price}
                  placeholder="Price"
                  required
                />
              </label>

              <label htmlFor="description">
                Description
                <textarea
                  onChange={this.handleChange}
                  id="description"
                  name="description"
                  value={this.state.description}
                  placeholder="Enter a description..."
                  required
                />
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateItem;

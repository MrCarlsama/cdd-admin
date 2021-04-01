import { Select } from "antd";
import React from "react";
import { useArtists } from "screens/artists/model";

type SelectProps = React.ComponentProps<typeof Select>;

interface ArtistSelectProps extends Omit<SelectProps, "value" | "onChange"> {
  value: number[] | null | undefined;
  onChange: (values: number[]) => void;
}

const toNumber = (value: unknown) => (isNaN(Number(value)) ? 0 : Number(value));

const toNumberArray = (values: any) =>
  values.map((value: unknown) => toNumber(value));

export const ArtistSelect = (props: ArtistSelectProps) => {
  const { value: values, onChange, ...restProps } = props;

  const { data: artists = [] } = useArtists();

  return (
    <Select
      mode="multiple"
      placeholder={"声优"}
      allowClear
      value={values?.map((value) => toNumber(value))}
      onChange={(values) => onChange(toNumberArray(values))}
      filterOption={(input, option) =>
        option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      {...restProps}
    >
      {artists.map((artist) => (
        <Select.Option key={artist.id} value={artist.id}>
          {artist.name}
        </Select.Option>
      ))}
    </Select>
  );
};

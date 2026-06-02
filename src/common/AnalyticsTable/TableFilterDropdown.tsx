import React from "react";
import { Dropdown, DropdownToggle, DropdownMenu, FormGroup, Label, Input, Button } from "reactstrap";

interface SelectOption {
  id: string | number;
  name: string;
}

interface FilterField {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: "text" | "select";
  options?: SelectOption[];
}

interface Props {
  isOpen: boolean;
  toggle: () => void;
  fields: FilterField[];
  onApply: () => void;
  onClear: () => void;
}

const TableFilterDropdown: React.FC<Props> = ({
  isOpen,
  toggle,
  fields,
  onApply,
  onClear,
}) => {
  return (
    <Dropdown isOpen={isOpen} toggle={toggle}>
      <DropdownToggle color="soft-success" size="sm" caret>
        Filter <i className="ri-filter-line"></i>
      </DropdownToggle>

      <DropdownMenu end className="p-3" style={{ width: "450px" }}>
        {fields.map((field, index) => (
          <FormGroup key={index}>
            <Label>{field.label}</Label>

            {/* ✅ IMPORTANT FIX HERE */}
            {field.type === "select" ? (
              <Input
                type="select"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
              >
                <option value="">Select</option>

                {field.options?.map((opt) => (
                  <option key={opt.id} value={opt.name}>
                    {opt.name}
                  </option>
                ))}
              </Input>
            ) : (
              <Input
                type="text"
                placeholder={field.placeholder}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          </FormGroup>
        ))}

        <div className="d-flex justify-content-end gap-2">
          <Button size="sm" color="secondary" onClick={onClear}>
            Clear
          </Button>

          <Button size="sm" color="primary" onClick={onApply}>
            Apply
          </Button>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

export default TableFilterDropdown;
---
- name: Copy Files from Source to Destination
  hosts: localhost
  gather_facts: false

  vars:
    # Define a dictionary to map sourceLocation values to absolute paths
    source_location_map:
      example_source1: /path/to/source1
      example_source2: /path/to/source2

    # Define a dictionary to map destinationLocation values to absolute paths
    destination_location_map:
      example_destination1: /path/to/destination1
      example_destination2: /path/to/destination2

  tasks:
    - name: Validate sourceLocation input
      fail:
        msg: "Invalid sourceLocation value provided."
      when: sourceLocation not in source_location_map

    - name: Validate destinationLocation input
      fail:
        msg: "Invalid destinationLocation value provided."
      when: destinationLocation not in destination_location_map

    - name: Set source and destination paths
      set_fact:
        source_path: "{{ source_location_map[sourceLocation] }}"
        destination_path: "{{ destination_location_map[destinationLocation] }}"
      when:
        - sourceLocation in source_location_map
        - destinationLocation in destination_location_map

    - name: Create destination folder if it does not exist
      ansible.builtin.file:
        path: "{{ destination_path }}"
        state: directory
      when: not (destination_path is defined and destination_path is not none)

    - name: Copy files from source to destination
      ansible.builtin.copy:
        src: "{{ item }}"
        dest: "{{ destination_path }}/{{ item | basename }}"
      loop: "{{ pathsToCopy.split('\n') }}"
      when: item != ''

- name: Output copied files
  debug:
    var: pathsToCopy.split('\n')
  when: pathsToCopy != ''
